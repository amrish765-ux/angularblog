import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post.model';



@Injectable({ providedIn: 'root' })
export class PostService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/api/user/${userId}/posts`);
  }
}
