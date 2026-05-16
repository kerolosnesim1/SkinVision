import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-wrapper">
      <div class="callback-card">
        <div *ngIf="!errorMessage" class="loading-state">
          <div class="spinner"></div>
          <h2>Signing you in...</h2>
          <p>Please wait while we complete your Google sign-in.</p>
        </div>

        <div *ngIf="errorMessage" class="error-state">
          <div class="error-icon">!</div>
          <h2>Sign-in Issue</h2>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <a href="/login" class="btn btn-primary">Go to Login</a>
            <a href="/register" class="btn btn-secondary">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #F0F8F9 0%, #ffffff 100%);
    }

    .callback-card {
      width: 100%;
      max-width: 420px;
      background: white;
      padding: 48px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .loading-state h2 {
      color: #167D7E;
      margin: 20px 0 8px;
      font-size: 22px;
    }

    .loading-state p {
      color: #666;
      font-size: 14px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e5e5;
      border-top-color: #167D7E;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state .error-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #ffebee;
      color: #c62828;
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .error-state h2 {
      color: #c62828;
      font-size: 22px;
      margin-bottom: 8px;
    }

    .error-state p {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .btn-primary {
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #e5e5e5;
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      const token = params['token'];
      const userBase64 = params['user'];
      const message = params['message'];

      if (error) {
        this.handleError(error, message);
        return;
      }

      if (token && userBase64) {
        try {
          const userJson = atob(userBase64);
          const user: User = JSON.parse(userJson);

          this.authService.handleOAuthCallback(token, user);
          this.router.navigate(['/dashboard']);
        } catch {
          this.errorMessage = 'Failed to process sign-in data. Please try again.';
        }
      } else {
        this.errorMessage = 'Invalid callback. Missing authentication data.';
      }
    });
  }

  private handleError(error: string, message?: string): void {
    switch (error) {
      case 'requires_linking':
        this.errorMessage = message || 'An account with this email already exists. Please log in with your password and link your Google account from profile settings.';
        break;
      case 'authentication_failed':
        this.errorMessage = 'Google authentication failed. Please try again.';
        break;
      case 'missing_claims':
        this.errorMessage = 'Could not retrieve your account information from Google. Please try again.';
        break;
      case 'server_error':
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
        break;
      default:
        this.errorMessage = 'Sign-in failed. Please try again.';
    }
  }
}
