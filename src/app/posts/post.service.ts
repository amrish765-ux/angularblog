import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post.model';

export type PostsPageResponse = {
  content: Post[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
};

@Injectable({ providedIn: 'root' })
export class PostService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) { }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/api/user/${userId}/posts`);
  }

  searchPosts(keyword: string): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.baseUrl}/api/posts/search/${encodeURIComponent(keyword)}`
    );
  }

  // paginated all posts
  getPosts(pageNumber = 0, pageSize = 5, direction: 'asc' | 'desc' = 'asc')
    : Observable<PostsPageResponse> {
    return this.http.get<PostsPageResponse>(
      `${this.baseUrl}/api/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&direction=${direction}`
    );
  }
}
