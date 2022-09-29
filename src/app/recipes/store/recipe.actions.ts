import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import { RecipeActionKind } from './recipe.state';

export const setRecipes = createAction(
  RecipeActionKind.SET_RECIPES,
  props<{ payload: Recipe[] }>()
);

export const fetchRecipes = createAction(RecipeActionKind.FETCH_RECIPES);
