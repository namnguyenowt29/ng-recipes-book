import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import {
  authClearError,
  authLoginStart,
  authFail,
  authSuccess,
  authLogout,
  authSignupStart,
} from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(authSuccess, (state, { email, userId, token, expirationDate }) => {
    const user = new User(email, userId, token, expirationDate);
    return {
      ...state,
      user: user,
      authError: null,
    };
  }),
  on(authLogout, (state) => {
    return {
      ...state,
      user: null,
    };
  }),
  on(authLoginStart, (state) => {
    return {
      ...state,
      authError: null,
    };
  }),
  on(authFail, (state, { errorMessage }) => {
    return {
      ...state,
      user: null,
      authError: errorMessage,
    };
  }),
  on(authSignupStart, (state) => {
    return {
      ...state,
      authError: null,
    };
  }),
  on(authClearError, (state) => {
    return {
      ...state,
      authError: null,
    };
  })
);
