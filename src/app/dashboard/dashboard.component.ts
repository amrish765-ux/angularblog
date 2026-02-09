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
  loading = true;

  posts: any[] = [];
  allPosts: any[] = []; // ✅ store all posts (all pages)

  search = new FormControl<string>('', { nonNullable: true });

  expanded = new Set<number>();

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // If your all-posts API is public, you do NOT need userId check here.
    // Keep it only if your dashboard should be protected.
    const userId = this.auth.userId;
    if (userId == null) {
      this.toast.show('error', 'Please login again');
      this.router.navigateByUrl('/login');
      return;
    }

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
    if (this.expanded.has(postId)) this.expanded.delete(postId);
    else this.expanded.add(postId);
  }

  isExpanded(postId: number): boolean {
    return this.expanded.has(postId);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
