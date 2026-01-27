import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2>Reset Password</h2>
        <p class="subtitle">Enter your email to receive a reset link</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" 
                   placeholder="Enter your registered email" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full">Send Reset Link</button>
        </form>

        <p class="auth-footer">
          Remember your password? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 450px;
      margin: 40px auto;
    }

    .auth-card {
      padding: 40px;
    }

    h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .subtitle {
      color: var(--text-light);
      margin-bottom: 30px;
    }

    .btn-full {
      width: 100%;
      margin-top: 10px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: var(--text-light);
    }

    .auth-footer a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      color: var(--secondary-color);
    }
  `]
})
export class ResetPasswordComponent {
  email = '';

  onSubmit() {
    console.log('Reset password for:', this.email);
    // TODO: Implement password reset logic
  }
}

