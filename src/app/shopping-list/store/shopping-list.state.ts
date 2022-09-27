import { Ingredient } from 'src/app/shared/ingredient.model';

// put initial state, actions and interface here
enum ShoppingListActionKind {
  ADD_INGREDIENT = '[Shopping List] ADD_INGREDIENT',
  ADD_INGREDIENTS = '[Shopping List] ADD_INGREDIENTS',
  DELETE_INGREDIENT = '[Shopping List] DELETE_INGREDIENT',
  UPDATE_INGREDIENT = '[Shopping List] UPDATE_INGREDIENT',
  START_EDIT = '[Shopping List] START_EDIT',
  STOP_EDIT = '[Shopping List] STOP_EDIT',
}

interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredientIndex: number;
  editedIngredient: Ingredient | null;
}

const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export { ShoppingListState, initialState, ShoppingListActionKind };
