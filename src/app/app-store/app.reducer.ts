import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store';
import { recipeReducer, RecipeState } from '../recipes/store';
import { shoppingListReducer, ShoppingListState } from '../shopping-list/store';

interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipe: RecipeState;
}

const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipe: recipeReducer,
};

export { AppState, appReducer };
