import { Injectable } from '@angular/core';
import { AppState } from '../app-store/app.reducer';
import { Store } from '@ngrx/store';
import { authLogout } from './store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer:
    | ReturnType<typeof setInterval>
    | null
    | undefined;
  constructor(private store: Store<AppState>) {}

  //when the token expires , auto logout
  setLogoutTimer(duration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(authLogout());
    }, duration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
