import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Observable, take } from 'rxjs';
import { AppState } from '../app-store/app.reducer';
import { Store } from '@ngrx/store';
import { fetchRecipes, setRecipes } from './store';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService,
    private store: Store<AppState>,
    private actions$: Actions
  ) {}

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const recipes = this.recipesService.getRecipes();

  //   if (recipes.length === 0) {
  //     return this.dataStorageService.fetchRecipes();
  //   } else {
  //     return recipes;
  //   }
  // }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    this.store.dispatch(fetchRecipes());
    return this.actions$.pipe(ofType(setRecipes));
  }
}
