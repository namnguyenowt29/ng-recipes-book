import { User } from '../user.model';

enum UserActionKind {
  LOGIN_START = '[Auth] LOGIN_START',
  AUTH_SUCCESS = '[Auth] AUTH_SUCCESS',
  AUTH_FAIL = '[Auth] AUTH_FAIL',
  SIGNUP_START = '[Auth] SIGNUP_START',
  LOGOUT = '[Auth] LOGOUT',
  AUTO_LOGIN = '[Auth] AUTO_LOGIN',
  CLEAR_ERROR = '[Auth] CLEAR_ERROR',
}

interface AuthState {
  user: User | null;
  authError: string | null;
}

const initialState: AuthState = {
  user: null,
  authError: null,
};

export { UserActionKind, AuthState, initialState };
