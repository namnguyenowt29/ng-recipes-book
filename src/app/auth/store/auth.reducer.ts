import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import { authLogin, authLogout } from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(authLogin, (state, { email, userId, token, expirationDate }) => {
    const user = new User(email, userId, token, expirationDate);
    return {
      ...state,
      user: user,
    };
  }),
  on(authLogout, (state) => {
    return {
      ...state,
      user: null,
    };
  })
);
