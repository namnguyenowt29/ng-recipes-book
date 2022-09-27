import { Component, OnInit } from '@angular/core';
import { AppState } from '../app-store/app.reducer';
import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { startEdit } from './store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }> | undefined;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(
      startEdit({
        payload: index,
      })
    );
  }
}
