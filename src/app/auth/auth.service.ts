import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './interfaces';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = new BehaviorSubject<User | null>(null);
  public readonly user = this._user.asObservable();
  private tokenExpirationTimer!: ReturnType<typeof setInterval> | null;

  constructor(private http: HttpClient, private router: Router) {}

  //when the token expires , auto logout
  autoLogout(duration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    this._user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const getDataStorage = localStorage.getItem('uer');
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
        this._user.next(loadedUser);
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
    );
    const currentUser = new User(email, userId, token, expirationDate);
    this._user.next(currentUser);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  private handleError(errResponse: HttpErrorResponse) {
    let message = '';
    if (!errResponse.error) {
      message = 'an unkown error occurred';
      throwError(message);
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
    return throwError(message);
  }
}
