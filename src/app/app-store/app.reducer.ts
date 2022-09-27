import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store';
import { shoppingListReducer, ShoppingListState } from '../shopping-list/store';

interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
}

const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
};

export { AppState, appReducer };
