import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type AuthResponse = any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = 'http://localhost:9090';

  constructor(private http: HttpClient) { }


  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/auth/create-user`, payload);
  }

  login(payload: LoginRequest) {
    return this.http.post<any>(`${this.baseURL}/auth/login`, payload).pipe(
      tap((res: any) => {
        const token = res?.token ?? res?.accessToken ?? res?.jwt ?? res?.data?.token;
        if (token) localStorage.setItem('token', token);
      })
    );
  }


  logout(): void {
    localStorage.removeItem('token');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }
}
