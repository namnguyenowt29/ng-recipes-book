import { Recipe } from '../recipe.model';

export enum RecipeActionKind {
  SET_RECIPES = '[Recipe] SET_RECIPES',
  FETCH_RECIPES = '[Recipe] FETCH_RECIPES',
}

export interface RecipeState {
  recipes: Recipe[];
}

export const initialState: RecipeState = {
  recipes: [],
};
