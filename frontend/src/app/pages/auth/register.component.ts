import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Register to start using SkinVision</p>
        </div>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="form.fullName" name="fullName" 
                   placeholder="Dr. Ahmed Hassan" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" 
                   placeholder="doctor@example.com" required>
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="form.phone" name="phone" 
                   placeholder="01012345678" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="form.password" name="password" 
                     placeholder="Create password" required>
              <small class="field-hint">
                At least 8 characters with uppercase, lowercase, number, and special character.
              </small>
            </div>
            <div class="form-group">
              <label>Confirm</label>
              <input type="password" [(ngModel)]="form.confirmPassword" name="confirmPassword" 
                     placeholder="Confirm" required>
            </div>
          </div>

          <hr class="divider">

          <div class="form-group">
            <label>Clinic Name</label>
            <input type="text" [(ngModel)]="form.clinicName" name="clinicName" 
                   placeholder="SkinCare Clinic" required>
          </div>

          <div class="form-group">
            <label>Clinic Address</label>
            <input type="text" [(ngModel)]="form.clinicAddress" name="clinicAddress" 
                   placeholder="123 Medical Center, Cairo" required>
          </div>

          <button type="submit" class="btn-submit" [disabled]="!isValid()">
            Create Account
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      max-width: 480px;
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

    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e5e5e5;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #167D7E;
    }

    .field-hint {
      display: block;
      margin-top: 6px;
      color: #666;
      font-size: 12px;
      line-height: 1.4;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .divider {
      border: none;
      border-top: 1px solid #e5e5e5;
      margin: 25px 0;
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
      margin-top: 10px;
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
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
      color: #167D7E;
      text-decoration: none;
      font-weight: 600;
    }

    @media (max-width: 500px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;
  errorMessage = '';

  form = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    clinicName: '',
    clinicAddress: ''
  };

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  isValid(): boolean {
    return this.form.fullName.trim() !== '' &&
           this.form.email.trim() !== '' &&
           this.form.phone.trim() !== '' &&
           this.form.password.trim() !== '' &&
           this.form.password === this.form.confirmPassword &&
           this.passwordPattern.test(this.form.password) &&
           this.form.clinicName.trim() !== '' &&
           this.form.clinicAddress.trim() !== '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.form.fullName.trim() ||
        !this.form.email.trim() ||
        !this.form.phone.trim() ||
        !this.form.password.trim() ||
        !this.form.clinicName.trim() ||
        !this.form.clinicAddress.trim()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    if (!this.passwordPattern.test(this.form.password)) {
      this.errorMessage =
        'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.';
      return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.auth.register(this.form).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.errorMessage = this.httpErrorMessage(err, 'Could not create account.');
      }
    });
  }

  private httpErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Cannot reach the API.';
      }
      if (typeof err.error === 'object' && err.error) {
        if ('message' in err.error) {
          return String((err.error as { message: string }).message);
        }
        if ('errors' in err.error) {
          const validationErrors = Object.values(
            (err.error as { errors: Record<string, string[]> }).errors
          ).flat();
          if (validationErrors.length > 0) {
            return validationErrors.join(' ');
          }
        }
      }
      if (err.message) {
        return err.message;
      }
    }
    return fallback;
  }
}