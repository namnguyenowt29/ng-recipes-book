import { HttpErrorResponse } from "@angular/common/http";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string; // second
  localId: string;
  registered?: boolean;
}

export interface ApiResonse<T> {
  data: T;
  error: HttpErrorResponse | Error;
  isLoading: boolean;
}
