import { createAction, props } from '@ngrx/store';
import { UserActionKind } from './auth.state';

// this action helps you to store the user info
const authLogin = createAction(
  UserActionKind.LOGIN,
  props<{
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
  }>()
);

const authLogout = createAction(UserActionKind.LOGOUT);

export { authLogin, authLogout };
