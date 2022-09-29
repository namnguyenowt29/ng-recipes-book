import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app-store/app.reducer';
import { LoadingService } from '../shared/loading.service';
import { authClearError, authLoginStart, authSignupStart } from './store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  authForm: FormGroup;
  errorMessage: string | null = null;
  loading$ = this.loader.loading;
  private closeSub: Subscription | undefined;
  private storeSub: Subscription | undefined;

  constructor(
    private loader: LoadingService,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.authForm = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((data) => {
      this.errorMessage = data.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  handleSubmit() {
    if (this.authForm.invalid) return;
    const { email, password } = this.authForm.value;
    if (this.isLoginMode) {
      this.store.dispatch(
        authLoginStart({
          email: email,
          password: password,
        })
      );
    } else {
      this.store.dispatch(
        authSignupStart({
          email: email,
          password: password,
        })
      );
    }
    this.authForm.reset();
  }

  handleCloseAlert() {
    this.errorMessage = null;
    this.store.dispatch(authClearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe();
    if (this.storeSub) this.storeSub.unsubscribe();
  }
}
