import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join SkinVision today</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>I am a</label>
            <div class="role-buttons">
              <button type="button" [class.active]="formData.role === 'patient'" (click)="formData.role = 'patient'">Patient</button>
              <button type="button" [class.active]="formData.role === 'doctor'" (click)="formData.role = 'doctor'">Doctor</button>
            </div>
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="formData.fullName" name="fullName" placeholder="Enter your full name" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="formData.email" name="email" placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="formData.password" name="password" placeholder="Create a password" required>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" [(ngModel)]="formData.confirmPassword" name="confirmPassword" placeholder="Confirm password" required>
          </div>

          <!-- Doctor fields -->
          <div *ngIf="formData.role === 'doctor'" class="form-group">
            <label>License Number</label>
            <input type="text" [(ngModel)]="formData.licenseNumber" name="licenseNumber" placeholder="Enter your medical license number" required>
          </div>

          <div *ngIf="formData.role === 'doctor'" class="form-group">
            <label>Years of Experience</label>
            <input type="number" [(ngModel)]="formData.experience" name="experience" placeholder="Enter years of experience" min="0" required>
          </div>

          <button type="submit" class="btn-submit" [disabled]="!isFormValid()">Create Account</button>
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

    .role-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .role-buttons button {
      padding: 14px;
      border: 2px solid #e5e5e5;
      border-radius: 10px;
      background: white;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .role-buttons button:hover {
      border-color: #167D7E;
    }

    .role-buttons button.active {
      background: #167D7E;
      color: white;
      border-color: #167D7E;
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
  `]
})
export class RegisterComponent {
  formData = {
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    experience: null as number | null
  };

  isFormValid(): boolean {
    const baseValid = this.formData.role !== '' && 
                      this.formData.fullName.trim() !== '' && 
                      this.formData.email.trim() !== '' && 
                      this.formData.password.trim() !== '' && 
                      this.formData.password === this.formData.confirmPassword;

    if (this.formData.role === 'doctor') {
      return baseValid && 
             this.formData.licenseNumber.trim() !== '' && 
             this.formData.experience !== null && 
             this.formData.experience >= 0;
    }

    return baseValid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      alert('Please fill all required fields');
      return;
    }
    console.log('Register form submitted:', this.formData);
  }
}

