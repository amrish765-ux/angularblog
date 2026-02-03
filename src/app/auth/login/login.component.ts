import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [FormBuilder],
})
export class LoginComponent {
  loading = false;
  error = '';

  form;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
   private toast: ToastService) {
    this.form = this.fb.group({
      username: ['', [Validators.required]], // backend expects username
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submit(): void {
    if (this.loading) return;
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('warning', 'Please fill all required fields');
      return;
    }

    this.loading = true;

    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.toast.show('success', 'Login successful');
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'username or password is incorrect';
        this.error = msg;          // optional (if you show text in UI)
      this.toast.show('error', msg);
      }
    });
  }
}
