import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
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

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Create one</a>
        </p>

        <div class="demo-section">
          <span>Quick Demo:</span>
          <button (click)="quickLogin('patient')">Patient</button>
          <button (click)="quickLogin('doctor')">Doctor</button>
          <button (click)="quickLogin('admin')">Admin</button>
        </div>
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

    .form-options a {
      color: #167D7E;
      text-decoration: none;
    }

    .form-options a:hover {
      text-decoration: underline;
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

    .demo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #888;
    }

    .demo-section button {
      padding: 6px 12px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .demo-section button:hover {
      background: #167D7E;
      color: white;
      border-color: #167D7E;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    // Mock authentication - check email to determine role
    let role = 'patient'; // default
    
    if (this.email.includes('doctor')) {
      role = 'doctor';
    } else if (this.email.includes('admin')) {
      role = 'admin';
    } else if (this.email.includes('patient')) {
      role = 'patient';
    }

    // Store mock user data
    localStorage.setItem('currentUser', JSON.stringify({
      email: this.email,
      role: role,
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' User'
    }));

    // Redirect based on role
    this.redirectToRoleDashboard(role);
  }

  quickLogin(role: string) {
    const emails = {
      patient: 'patient@test.com',
      doctor: 'doctor@test.com',
      admin: 'admin@test.com'
    };

    this.email = emails[role as keyof typeof emails];
    this.password = 'demo123';
    
    // Store mock user
    localStorage.setItem('currentUser', JSON.stringify({
      email: this.email,
      role: role,
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' Demo'
    }));

    this.redirectToRoleDashboard(role);
  }

  private redirectToRoleDashboard(role: string) {
    const routes: { [key: string]: string } = {
      patient: '/patient',
      doctor: '/doctor',
      admin: '/admin'
    };

    this.router.navigate([routes[role]]);
  }
}


