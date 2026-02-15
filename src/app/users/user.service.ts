import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    password?: string; // Optional for response, required for update usually
    about?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:9090';

    constructor(private http: HttpClient) { }

    // Get all users
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/api/user/`);
    }

    // Get user by ID
    getUser(userId: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/api/user/${userId}`);
    }

    // Update user
    updateUser(userId: number, user: any): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/api/user/${userId}`, user);
    }

    // Delete user
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/user/${userId}`);
    }
}
