import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/Profile.Service';
import { AuthService } from '../../services/auth.service';
import { DoctorProfile } from '../../models/models';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <a routerLink="/doctor" class="back-link">← Back to Dashboard</a>
        <h1>Profile Settings</h1>
      </div>

      <div class="profile-grid">
        <div class="card">
          <h2>Personal Information</h2>
          <div *ngIf="isLoading" class="muted">Loading profile...</div>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="profile.fullName">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [value]="email" disabled>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="profile.phone">
          </div>
          <button class="btn btn-primary" (click)="savePersonal()">Save Changes</button>
        </div>

        <div class="card">
          <h2>Clinic Information</h2>
          <div class="form-group">
            <label>Clinic Name</label>
            <input type="text" [(ngModel)]="profile.clinicName">
          </div>
          <div class="form-group">
            <label>Clinic Address</label>
            <textarea [(ngModel)]="profile.clinicAddress" rows="2"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Specialization</label>
              <input type="text" [(ngModel)]="profile.specialization">
            </div>
            <div class="form-group">
              <label>Years of Experience</label>
              <input type="number" [(ngModel)]="profile.yearsExperience">
            </div>
          </div>
          <button class="btn btn-primary" (click)="saveClinic()">Save Changes</button>
        </div>

        <div class="card">
          <h2>Change Password</h2>
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" [(ngModel)]="password.current">
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" [(ngModel)]="password.new">
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" [(ngModel)]="password.confirm">
          </div>
          <button class="btn btn-primary" (click)="changePassword()">Update Password</button>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-text">{{ errorMessage }}</div>
      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      margin-bottom: 25px;
    }

    .back-link {
      color: var(--text-light);
      text-decoration: none;
      font-size: 14px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 8px 0 0 0;
    }

    .profile-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card h2 {
      font-size: 18px;
      color: var(--text-dark);
      margin: 0 0 20px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .card .btn {
      margin-top: 10px;
    }

    .muted {
      color: var(--text-light);
      margin-bottom: 10px;
    }

    .error-text {
      margin-top: 14px;
      color: #b42318;
      font-size: 14px;
    }

    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      z-index: 1000;
    }
  `]
})
export class DoctorProfileComponent implements OnInit {
  profile: DoctorProfile = {
    doctorId: 0,
    fullName: '',
    phone: '',
    clinicName: '',
    clinicAddress: '',
    specialization: '',
    yearsExperience: undefined
  };
  email = '';
  isLoading = true;
  errorMessage = '';
  toastMessage = '';

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.email = currentUser?.email ?? '';
    this.loadProfile();
  }

  savePersonal(): void {
    this.updateProfile();
  }

  saveClinic(): void {
    this.updateProfile();
  }

  changePassword(): void {
    if (this.password.new !== this.password.confirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.errorMessage = '';
    this.authService.changePassword(this.password.current, this.password.new).subscribe({
      next: () => {
        this.password = { current: '', new: '', confirm: '' };
        this.showToast('Password updated');
      },
      error: (error) => {
        console.error('Failed to change password:', error);
        this.errorMessage = 'Failed to change password.';
      }
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = { ...this.profile, ...profile };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.errorMessage = 'Failed to load profile.';
        this.isLoading = false;
      }
    });
  }

  private updateProfile(): void {
    this.errorMessage = '';
    this.profileService.updateProfile(this.profile).subscribe({
      next: (updated) => {
        this.profile = { ...this.profile, ...updated };
        this.showToast('Profile updated');
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        this.errorMessage = 'Failed to update profile.';
      }
    });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
