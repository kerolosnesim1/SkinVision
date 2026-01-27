import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>

          <button type="submit" class="btn-submit">Send Reset Link</button>
        </form>

        <p class="auth-footer">
          Remember your password? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 100px 20px 40px; background: linear-gradient(135deg, #F0F8F9 0%, #ffffff 100%); }
    .auth-card { width: 100%; max-width: 420px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
    .auth-header { text-align: center; margin-bottom: 30px; }
    .auth-header h1 { font-size: 28px; color: #167D7E; margin-bottom: 8px; }
    .auth-header p { color: #666; font-size: 15px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
    .form-group input { width: 100%; padding: 14px 16px; border: 2px solid #e5e5e5; border-radius: 10px; font-size: 15px; }
    .form-group input:focus { outline: none; border-color: #167D7E; }
    .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #167D7E, #2BB1B8); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .auth-footer { text-align: center; margin-top: 25px; color: #666; font-size: 14px; }
    .auth-footer a { color: #167D7E; text-decoration: none; font-weight: 600; }
  `]
})
export class ResetPasswordComponent {
  email = '';
  onSubmit() {
    if (!this.email) { alert('Please enter your email'); return; }
    alert('Password reset link sent to ' + this.email);
  }
}
