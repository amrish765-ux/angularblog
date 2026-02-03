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
      const token =
        res?.token ?? res?.accessToken ?? res?.jwt ?? res?.data?.token;

      if (token) localStorage.setItem('token', token);

      // ✅ your backend now returns: { userId, username, token }
      const userId = res?.userId ?? res?.id ?? res?.user?.id ?? res?.userDto?.id;

      if (userId != null) localStorage.setItem('userId', String(userId));

      const username = res?.username ?? res?.user?.email ?? res?.userDto?.email;
      if (username) localStorage.setItem('username', String(username));
    })
  );
}



  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get userId(): number | null {
    const v = localStorage.getItem('userId');
    return v ? Number(v) : null;
  }
}
