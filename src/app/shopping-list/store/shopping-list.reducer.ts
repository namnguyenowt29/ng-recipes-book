import { createReducer, on } from '@ngrx/store';
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  initialState,
  startEdit,
  stopEdit,
  updateIngredient,
} from './shopping-list.actions';

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, { payload }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, payload],
    };
  }),
  on(addIngredients, (state, { payload }) => {
    return {
      ...state,
      ingredients: [...state.ingredients, ...payload],
    };
  }),
  on(deleteIngredient, (state) => {
    const remainingIngredients = state.ingredients.filter(
      (_item, index) => index !== state.editedIngredientIndex
    );

    return {
      ...state,
      ingredients: remainingIngredients,
    };
  }),
  on(updateIngredient, (state, { ingredient }) => {
    // update the current ingredient
    const currentIngredient = state.ingredients[state.editedIngredientIndex];
    const updateIngrdient = {
      ...currentIngredient,
      ...ingredient,
    };
    //update ingredients
    const updateIngrdients = [...state.ingredients];
    updateIngrdients[state.editedIngredientIndex] = updateIngrdient;

    return {
      ...state,
      ingredients: updateIngrdients,
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
  }),
  on(startEdit, (state, { payload }) => {
    return {
      ...state,
      editedIngredientIndex: payload,
      editedIngredient: state.ingredients[payload],
    };
  }),
  on(stopEdit, (state) => {
    return {
      ...state,
      editedIngredient: null,
      editedIngredientIndex: -1,
    };
  })
);
