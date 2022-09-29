import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.reducer';
import { setRecipes } from '../recipes/store';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(environment.mainApi, recipes).subscribe();
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(environment.mainApi).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => this.store.dispatch(setRecipes({ payload: recipes })))
    );
  }
}
