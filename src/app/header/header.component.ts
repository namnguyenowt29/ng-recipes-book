import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AppState } from '../app-store/app.reducer';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
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
    this.authService.logout();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
