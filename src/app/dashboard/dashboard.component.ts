import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../posts/post.service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  loading = true;
  posts: any[] = [];

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const userId = this.auth.userId;
    if (userId == null) {
      this.toast.show('error', 'Please login again');
      this.router.navigateByUrl('/login');
      return;
    }

    this.postService.getPostsByUser(userId).subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('error', 'Failed to load posts');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }


  expanded = new Set<number>();

  toggleComments(postId: number) {
    if (this.expanded.has(postId)) this.expanded.delete(postId);
    else this.expanded.add(postId);
  }

  isExpanded(postId: number): boolean {
    return this.expanded.has(postId);
  }

}
