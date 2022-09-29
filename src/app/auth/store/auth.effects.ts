import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  authSuccess,
  authFail,
  authSignupStart,
  authLogout,
  authAutoLogin,
  authLoginStart,
} from '.';
import { AuthService } from '../auth.service';
import { AuthResponseData } from '../interfaces';
import { User } from '../user.model';

const handleError = (errResponse: HttpErrorResponse) => {
  let message = '';
  if (!errResponse.error) {
    message = 'an unkown error occurred';
    return of(authFail({ errorMessage: message }));
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
      message = 'The password is invalid or the user does not have a password.';
    } else if (errResponse.error.error.message === 'USER_DISABLED') {
      message = 'The user account has been disabled by an administrator.';
    }
  }
  return of(authFail({ errorMessage: message }));
};

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('user', JSON.stringify(user));
  return authSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authLoginStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(environment.loginApi, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((data) => {
              return handleAuthentication(
                data.email,
                data.localId,
                data.idToken,
                data.expiresIn
              );
            }),
            catchError((errResponse: HttpErrorResponse) => {
              return handleError(errResponse);
            })
          );
      })
    )
  );

  authAutoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAutoLogin),
      map(() => {
        const getDataStorage = localStorage.getItem('user');
        const userData: {
          email: string;
          userId: string;
          _token: string;
          _tokenExpirationDate: Date;
        } = getDataStorage && JSON.parse(getDataStorage);
        let loadedUser: User | undefined = undefined;
        if (!userData) {
          loadedUser = undefined;
        } else {
          loadedUser = new User(
            userData.email,
            userData.userId,
            userData._token,
            new Date(userData._tokenExpirationDate)
          );
        }
        if (loadedUser?.token) {
          // duration = future date - current date
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return authSuccess({
            email: loadedUser.email,
            userId: loadedUser.userId,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        } else return { type: 'dummy' };
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogout),
        tap(() => {
          localStorage.removeItem('user');
          this.authService.clearLogoutTimer();
          this.router.navigate(['/auth']);
        })
      ),
    {
      dispatch: false,
    }
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authSuccess),
        tap((data) => {
          if (data.redirect) this.router.navigate(['/']);
        })
      ),
    {
      dispatch: false,
    }
  );

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authSignupStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(environment.signupApi, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .pipe(
            map((data) => {
              return handleAuthentication(
                data.email,
                data.localId,
                data.idToken,
                data.expiresIn
              );
            }),
            catchError((errResponse: HttpErrorResponse) => {
              return handleError(errResponse);
            })
          );
      })
    )
  );
}
