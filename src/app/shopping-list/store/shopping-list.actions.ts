import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListActionKind, initialState } from './shopping-list.state';

const addIngredient = createAction(
  ShoppingListActionKind.ADD_INGREDIENT,
  props<{ payload: Ingredient }>()
);

const addIngredients = createAction(
  ShoppingListActionKind.ADD_INGREDIENTS,
  props<{ payload: Ingredient[] }>()
);

const deleteIngredient = createAction(ShoppingListActionKind.DELETE_INGREDIENT);

const updateIngredient = createAction(
  ShoppingListActionKind.UPDATE_INGREDIENT,
  props<{ ingredient: Ingredient }>()
);

const startEdit = createAction(
  ShoppingListActionKind.START_EDIT,
  props<{ payload: number }>()
);
const stopEdit = createAction(ShoppingListActionKind.STOP_EDIT);

export {
  initialState,
  addIngredient,
  addIngredients,
  deleteIngredient,
  updateIngredient,
  startEdit,
  stopEdit,
};
