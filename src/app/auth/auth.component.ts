import {
  Component,
  // ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
// import { AlertComponent } from "../shared/alert/alert.component";
import { LoadingService } from '../shared/loading.service';
// import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService } from './auth.service';
import { AuthResponseData } from './interfaces';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  authForm: FormGroup;
  errorMessage: string | null = null;
  // @ViewChild(PlaceholderDirective, {
  //   static: false,
  // })
  // alertHost: PlaceholderDirective;
  // optional: use AuthResponeData<T>
  loading$ = this.loader.loading;
  private closeSub!: Subscription;

  constructor(
    private router: Router,
    private loader: LoadingService,
    private fb: FormBuilder,
    private authService: AuthService // private cmpFactoryResolver: ComponentFactoryResolver
  ) {
    this.authForm = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  handleSubmit() {
    if (this.authForm.invalid) return;
    const { email, password } = this.authForm.value;
    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe({
      next: () => {
        if (this.isLoginMode) this.router.navigate(['/recipes']);
      },
      error: (err: string) => {
        this.errorMessage = err;
        // this.showErrorAlert(this.errorMessage);
      },
    });
    this.authForm.reset();
  }

  handleCloseAlert() {
    this.errorMessage = null;
  }

  // private showErrorAlert(message: string) {
  //   // remove it in Angular v >= 13, you component directly
  //   const cmpFactory =
  //     this.cmpFactoryResolver.resolveComponentFactory(AlertComponent);
  //   const hostVcRef = this.alertHost.vcRef;
  //   hostVcRef.clear();
  //   const cmpRef = hostVcRef.createComponent(cmpFactory);
  //   // data binding
  //   cmpRef.instance.message = message;
  //   this.closeSub = cmpRef.instance.close.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostVcRef.clear();
  //   });
  // }

  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe();
  }
}
