import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

function passwordMatch(c: AbstractControl): ValidationErrors | null {
  const p = c.get('password')?.value;
  const cp = c.get('confirmPassword')?.value;
  return p && cp && p !== cp ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  loading = false;
  error = '';
  success = '';

  form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      age: [18, [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['male', [Validators.required]],
    }, { validators: passwordMatch });
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { name, email, password, age, gender } = this.form.getRawValue();

    this.auth.signup({
      name: name!,
      email: email!,
      password: password!,
      age: Number(age),
      gender: gender as any
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created. Please login.';
        setTimeout(() => this.router.navigateByUrl('/login'), 600);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Signup failed';
      }
    });
  }
}
