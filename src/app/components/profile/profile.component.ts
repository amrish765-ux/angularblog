import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

import { PostService } from '../../posts/post.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  userId: number | null = null;
  activeTab: string = 'posts';
  userPosts: any[] = [];
  loading = false;

  stats = {
    posts: 0,
    followers: 1250,
    following: 156
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.userId = this.auth.userId;

    if (this.userId) {
      this.loadPosts();
    }
  }

  loadPosts() {
    this.loading = true;
    this.postService.getPostsByUser(this.userId!).subscribe({
      next: (posts) => {
        this.userPosts = posts;
        this.stats.posts = posts.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts', err);
        this.loading = false;
      }
    });
  }

  getPostGradient(postId: number): string {
    const hue1 = (postId * 50) % 360;
    const hue2 = (hue1 + 60) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 40%))`;
  }

  getPostExcerpt(content: string): string {
    if (!content) return 'No content';
    if (content.length <= 80) return content;
    return content.slice(0, 80) + '...';
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
