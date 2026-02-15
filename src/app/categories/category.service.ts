import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private baseUrl = 'http://localhost:9090';

    constructor(private http: HttpClient) { }

    // Create a new category
    createCategory(category: any): Observable<Category> {
        return this.http.post<Category>(`${this.baseUrl}/api/categories/`, category);
    }

    // Get all categories
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.baseUrl}/api/categories/`);
    }

    // Get a single category
    getCategory(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.baseUrl}/api/categories/${id}`);
    }

    // Update a category
    updateCategory(id: number, category: any): Observable<Category> {
        return this.http.put<Category>(`${this.baseUrl}/api/categories/${id}`, category);
    }

    // Delete a category
    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/categories/${id}`);
    }
}
