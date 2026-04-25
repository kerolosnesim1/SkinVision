import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ token ? 'Set new password' : 'Reset password' }}</h1>
          <p>
            {{
              token
                ? 'Choose a new password for your account.'
                : 'Enter your email. If an account exists, you will receive reset instructions.'
            }}
          </p>
        </div>

        <div *ngIf="successMessage" class="success-banner">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="error-banner">{{ errorMessage }}</div>

        <form *ngIf="!token" (ngSubmit)="onRequestReset()">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email"
              required
              [disabled]="submitting"
            />
          </div>
          <button type="submit" class="btn-submit" [disabled]="submitting || !email">
            {{ submitting ? 'Sending…' : 'Send reset link' }}
          </button>
        </form>

        <form *ngIf="token" (ngSubmit)="onSetNewPassword()">
          <div class="form-group">
            <label>New password</label>
            <input
              type="password"
              [(ngModel)]="newPassword"
              name="newPassword"
              placeholder="At least 8 characters"
              required
              minlength="8"
              [disabled]="submitting"
            />
          </div>
          <div class="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              [disabled]="submitting"
            />
          </div>
          <button
            type="submit"
            class="btn-submit"
            [disabled]="submitting || !newPassword || newPassword !== confirmPassword"
          >
            {{ submitting ? 'Saving…' : 'Update password' }}
          </button>
        </form>

        <p class="auth-footer">
          Remember your password? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 100px 20px 40px;
        background: linear-gradient(135deg, #f0f8f9 0%, #ffffff 100%);
      }
      .auth-card {
        width: 100%;
        max-width: 420px;
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      }
      .auth-header {
        text-align: center;
        margin-bottom: 30px;
      }
      .auth-header h1 {
        font-size: 28px;
        color: #167d7e;
        margin-bottom: 8px;
      }
      .auth-header p {
        color: #666;
        font-size: 15px;
      }
      .form-group {
        margin-bottom: 20px;
      }
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }
      .form-group input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e5e5;
        border-radius: 10px;
        font-size: 15px;
        box-sizing: border-box;
      }
      .form-group input:focus {
        outline: none;
        border-color: #167d7e;
      }
      .btn-submit {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #167d7e, #2bb1b8);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .auth-footer {
        text-align: center;
        margin-top: 25px;
        color: #666;
        font-size: 14px;
      }
      .auth-footer a {
        color: #167d7e;
        text-decoration: none;
        font-weight: 600;
      }
      .success-banner {
        background: #e8f5e9;
        color: #2e7d32;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
      }
      .error-banner {
        background: #ffebee;
        color: #c62828;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
      }
    `
  ]
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
  }

  onRequestReset(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }
    this.submitting = true;
    this.auth.forgotPassword(this.email.trim()).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submitting = false;
      },
      error: (err: unknown) => {
        this.submitting = false;
        this.errorMessage = this.httpErrorMessage(err, 'Could not start password reset.');
      }
    });
  }

  onSetNewPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.submitting = true;
    this.auth.resetPasswordWithToken(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: unknown) => {
        this.submitting = false;
        this.errorMessage = this.httpErrorMessage(err, 'Could not reset password.');
      }
    });
  }

  private httpErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Cannot reach the API.';
      }
      if (typeof err.error === 'object' && err.error && 'message' in err.error) {
        return String((err.error as { message: string }).message);
      }
      if (err.message) {
        return err.message;
      }
    }
    return fallback;
  }
}
