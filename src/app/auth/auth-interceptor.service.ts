import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AppState } from '../app-store/app.reducer';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    // private authService: AuthService,
    private store: Store<AppState>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      exhaustMap((authData) => {
        if (!authData) {
          return next.handle(req);
        }
        const modifieReq = req.clone({
          params: new HttpParams().set('auth', <string>authData.user?.token),
        });
        return next.handle(modifieReq);
      })
    );
  }
}
