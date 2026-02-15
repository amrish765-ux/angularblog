import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../posts/post.service';
import { ToastService } from '../shared/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  loading = false;

  posts: any[] = [];
  allPosts: any[] = [];

  search = new FormControl<string>('', { nonNullable: true });

  expanded = new Set<number>();

  username: string | null = null;

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // If your all-posts API is public, you do NOT need userId check here.
    // Keep it only if your dashboard should be protected.
    const userId = this.auth.userId;
    if (userId == null) {
      this.toast.show('error', 'Please login again');
      this.router.navigateByUrl('/login');
      return;
    }

    // Get username for display
    this.username = localStorage.getItem('username');

    // ✅ Load ALL posts (paginated)
    this.loadAllPosts();

    // ✅ Search (server-side) + cancel previous request with switchMap
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          const query = q.trim();

          // empty => show all already loaded posts
          if (!query) {
            this.posts = [...this.allPosts];
            return of(null);
          }

          return this.postService.searchPosts(query).pipe(
            catchError(() => {
              this.toast.show('error', 'Search failed');
              return of([]); // return empty list on error
            })
          );
        })
      )
      .subscribe((res: any) => {
        if (res === null) return;      // handled by empty query case
        this.posts = res ?? [];
      });
  }

  // ✅ Load all pages
  loadAllPosts() {
    this.loading = true;
    this.allPosts = [];
    this.posts = [];
    this.fetchPage(0, 50); // pageSize can be 5,10,20,50...
  }

  private fetchPage(pageNumber: number, pageSize: number) {
    this.postService.getPosts(pageNumber, pageSize, 'asc').subscribe({
      next: (res: any) => {
        this.allPosts.push(...(res.content ?? []));

        if (res.lastPage === true || pageNumber + 1 >= (res.totalPages ?? 0)) {
          this.loading = false;

          // show all unless user is currently searching
          const q = this.search.value.trim();
          this.posts = q ? this.posts : [...this.allPosts];
        } else {
          this.fetchPage(pageNumber + 1, pageSize);
        }
      },
      error: () => {
        this.loading = false;
        this.toast.show('error', 'Failed to load posts');
      },
    });
  }

  toggleComments(postId: number) {
    if (this.expanded.has(postId)) {
      this.expanded.delete(postId);
    } else {
      this.expanded.add(postId);
    }
  }

  isExpanded(postId: number): boolean {
    return this.expanded.has(postId);
  }

  submitComment(post: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!value.trim()) return;

    this.postService.createComment(post.postId, value).subscribe({
      next: (res: any) => {
        // The API returns the created comment. Push it to local list.
        if (!post.comments) post.comments = [];

        // If response is the comment object
        post.comments.push(res);

        input.value = '';
        this.toast.show('success', 'Comment added');
      },
      error: () => this.toast.show('error', 'Failed to add comment')
    });
  }

  addComment(post: any, content: string) {
    if (!content.trim()) return;

    this.postService.createComment(post.postId, content).subscribe({
      next: (newComment: any) => {
        post.comments = post.comments || [];
        post.comments.push(newComment);
        this.toast.show('success', 'Comment added');
      },
      error: () => this.toast.show('error', 'Failed to add comment')
    });
  }

  deleteComment(post: any, commentId: number) {
    if (!confirm('Are you sure?')) return;

    this.postService.deleteComment(commentId).subscribe({
      next: () => {
        post.comments = post.comments.filter((c: any) => c.id !== commentId);
        this.toast.show('success', 'Comment deleted');
      },
      error: () => this.toast.show('error', 'Failed to delete comment')
    });
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
