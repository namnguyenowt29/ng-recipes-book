import { createReducer, on } from '@ngrx/store';
import { fetchRecipes, setRecipes } from './recipe.actions';
import { initialState } from './recipe.state';

export const recipeReducer = createReducer(
  initialState,
  on(setRecipes, (state, { payload }) => {
    return {
      ...state,
      recipes: [...payload],
    };
  }),
  on(fetchRecipes, (state) => {
    return {
      ...state,
    };
  })
);
