import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  //  BehaviorSubject,
  throwError,
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppState } from '../app-store/app.reducer';
import { AuthResponseData } from './interfaces';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { authLogin, authLogout } from './store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private readonly _user = new BehaviorSubject<User | null>(null);
  // public readonly user = this._user.asObservable();
  private tokenExpirationTimer:
    | ReturnType<typeof setInterval>
    | null
    | undefined;
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>
  ) {}

  //when the token expires , auto logout
  autoLogout(duration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    // this._user.next(null);
    this.store.dispatch(authLogout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const getDataStorage = localStorage.getItem('user');
    const userData: {
      email: string;
      userId: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = getDataStorage && JSON.parse(getDataStorage);
    if (!userData) return;
    else {
      const loadedUser = new User(
        userData.email,
        userData.userId,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        // this._user.next(loadedUser);
        this.store.dispatch(
          authLogin({
            email: loadedUser.email,
            userId: loadedUser.userId,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
          })
        );
        // duration = future date - current date
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(environment.signupApi, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(environment.loginApi, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((err) => this.handleError(err)),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(
      new Date().getTime() + Number(expiresIn) * 1000
      /* second => mili second */
    ); // this._user.next(currentUser);
    this.store.dispatch(
      authLogin({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
      })
    );
    this.autoLogout(+expiresIn * 1000);
    // save to local storage
    const currentUser = new User(email, userId, token, expirationDate);
    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  private handleError(errResponse: HttpErrorResponse) {
    let message = '';
    if (!errResponse.error) {
      message = 'an unkown error occurred';
      throwError(() => new Error(message));
    } else {
      if (errResponse.error.error.message === 'EMAIL_EXISTS') {
        message = 'The email address is already in use by another account.';
      } else if (errResponse.error.error.message === 'OPERATION_NOT_ALLOWED') {
        message = 'Password sign-in is disabled for this project.';
      } else if (
        errResponse.error.error.message === 'TOO_MANY_ATTEMPTS_TRY_LATER'
      ) {
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
      } else if (errResponse.error.error.message === 'EMAIL_NOT_FOUND') {
        message = 'There is no user record corresponding to this identifier';
      } else if (errResponse.error.error.message === 'INVALID_PASSWORD') {
        message =
          'The password is invalid or the user does not have a password.';
      } else if (errResponse.error.error.message === 'USER_DISABLED') {
        message = 'The user account has been disabled by an administrator.';
      }
    }
    return throwError(() => new Error(message));
  }
}
