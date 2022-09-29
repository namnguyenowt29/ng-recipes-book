import { createAction, props } from '@ngrx/store';
import { UserActionKind } from './auth.state';

// this action helps you to store the user info
export const authSuccess = createAction(
  UserActionKind.AUTH_SUCCESS,
  props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }>()
);

export const authLogout = createAction(UserActionKind.LOGOUT);

export const authLoginStart = createAction(
  UserActionKind.LOGIN_START,
  props<{ email: string; password: string }>()
);

export const authFail = createAction(
  UserActionKind.AUTH_FAIL,
  props<{ errorMessage: string }>()
);

export const authSignupStart = createAction(
  UserActionKind.SIGNUP_START,
  props<{ email: string; password: string }>()
);

export const authClearError = createAction(UserActionKind.CLEAR_ERROR);

export const authAutoLogin = createAction(UserActionKind.AUTO_LOGIN);
