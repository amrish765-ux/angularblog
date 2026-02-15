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

  // Get single post by ID
  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/api/posts/${postId}`);
  }

  // Create a new post
  createPost(post: any, userId: number, categoryId: number): Observable<Post> {
    return this.http.post<Post>(
      `${this.baseUrl}/api/user/${userId}/category/${categoryId}/posts`,
      post
    );
  }

  // Update an existing post
  updatePost(postId: number, post: any): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/api/posts/${postId}`, post);
  }

  // Delete a post
  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/posts/${postId}`);
  }

  // Get posts by category
  getPostsByCategory(categoryId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/api/category/${categoryId}/posts`);
  }

  // Create a comment
  createComment(postId: number, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/post/${postId}/comments`, { content });
  }

  // Delete a comment
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/comments/${commentId}`);
  }

  // paginated all posts
  getPosts(pageNumber = 0, pageSize = 5, direction: 'asc' | 'desc' = 'asc')
    : Observable<PostsPageResponse> {
    return this.http.get<PostsPageResponse>(
      `${this.baseUrl}/api/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&direction=${direction}`
    );
  }
}
