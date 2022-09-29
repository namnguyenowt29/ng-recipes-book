import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from '../app-store/app.reducer';
import { authLogout } from '../auth/store';
import { fetchRecipes } from '../recipes/store';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(map((authData) => authData.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  handleLogout() {
    this.store.dispatch(authLogout());
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.store.dispatch(fetchRecipes());
  }
}
