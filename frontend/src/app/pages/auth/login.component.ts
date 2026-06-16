import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your SkinVision account</p>
        </div>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
            <label class="checkbox show-password-checkbox">
              <input type="checkbox" [(ngModel)]="showPassword" name="showPassword">
              <span>Show password</span>
            </label>
          </div>

          <div class="form-options">
            <label class="checkbox">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Remember me</span>
            </label>
            <a routerLink="/reset-password">Forgot password?</a>
          </div>

          <button type="submit" class="btn-submit">Sign In</button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

        <button class="btn-google" (click)="googleLogin()" id="google-login-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 20px 40px;
      background: linear-gradient(135deg, #F0F8F9 0%, #ffffff 100%);
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
      color: #167D7E;
      margin-bottom: 8px;
    }

    .auth-header p {
      color: #666;
      font-size: 15px;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
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
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #167D7E;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      font-size: 14px;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #555;
    }

    .checkbox input {
      width: 16px;
      height: 16px;
    }

    .show-password-checkbox {
      margin-top: 8px;
      font-size: 13px;
    }

    .form-options a {
      color: #167D7E;
      text-decoration: none;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .btn-submit:hover {
      opacity: 0.9;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e5e5e5;
    }

    .divider span {
      padding: 0 16px;
      color: #999;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-google {
      width: 100%;
      padding: 13px 16px;
      background: white;
      border: 2px solid #e5e5e5;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
    }

    .btn-google:hover {
      border-color: #167D7E;
      background: #f8fffe;
      box-shadow: 0 2px 8px rgba(22, 125, 126, 0.1);
    }

    .auth-footer {
      text-align: center;
      margin-top: 25px;
      color: #666;
      font-size: 14px;
    }

    .auth-footer a {
      color: #167D7E;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService

  ) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }


    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}





