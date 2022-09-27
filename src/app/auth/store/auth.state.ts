import { User } from '../user.model';

enum UserActionKind {
  LOGIN = '[Auth] LOGIN',
  LOGOUT = '[Auth] LOGOUT',
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export { UserActionKind, AuthState, initialState };
