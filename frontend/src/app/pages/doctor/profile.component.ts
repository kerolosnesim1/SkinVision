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
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        <h1>Profile Settings</h1>
      </div>

      <div class="profile-grid">
        <div class="card form-grid">
          <h2>Personal Information</h2>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="profile.fullName">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="profile.phone">
          </div>
          <div class="form-group form-span-full">
            <label>Email</label>
            <input type="email" [value]="email" disabled>
          </div>
          <button class="btn btn-primary" (click)="savePersonal()">Save Changes</button>
        </div>

        <div class="card form-grid">
          <h2>Change Password</h2>
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" [(ngModel)]="password.current">
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" [(ngModel)]="password.new">
          </div>
          <div class="form-group form-span-full">
            <label>Confirm New Password</label>
            <input type="password" [(ngModel)]="password.confirm">
          </div>
          <button class="btn btn-primary" (click)="changePassword()">Update Password</button>
        </div>

        <div class="card form-grid card-span-row">
          <h2>Clinic Information</h2>
          <div class="form-group">
            <label>Clinic Name</label>
            <input type="text" [(ngModel)]="profile.clinicName">
          </div>
          <div class="form-group">
            <label>Years of Experience</label>
            <input type="number" [(ngModel)]="profile.yearsExperience">
          </div>
          <div class="form-group form-span-full">
            <label>Specialization</label>
            <input type="text" [(ngModel)]="profile.specialization">
          </div>
          <div class="form-group form-span-full">
            <label>Clinic Address</label>
            <textarea [(ngModel)]="profile.clinicAddress" rows="2"></textarea>
          </div>
          <button class="btn btn-primary" (click)="saveClinic()">Save Changes</button>
        </div>

      </div>

      <div *ngIf="errorMessage" class="error-text">{{ errorMessage }}</div>
      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }

    .page-header {
      margin-bottom: 20px;
    }

    .back-link {
      color: var(--text-light);
      text-decoration: none;
      font-size: 13px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 6px 0 0;
      font-size: 24px;
      font-weight: 700;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: stretch;
    }

    .card {
      background: var(--white);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      min-width: 0;
    }

    .card-span-row {
      grid-column: 1 / -1;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 16px;
      align-items: start;
    }

    .form-grid > h2 {
      grid-column: 1 / -1;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-dark);
      margin: 0 0 4px;
    }

    .form-grid > .btn {
      grid-column: 1 / -1;
      margin-top: 4px;
      padding: 10px 18px;
      font-size: 14px;
      justify-self: start;
    }

    .form-span-full {
      grid-column: 1 / -1;
    }

    .form-group {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 5px;
      color: var(--text-dark);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 9px 12px;
      font-size: 14px;
      border-radius: 8px;
      border: 2px solid var(--border-color);
    }

    .form-group input:disabled {
      background: #f9fafb;
      color: var(--text-light);
    }

    .error-text {
      margin-top: 12px;
      color: #b42318;
      font-size: 13px;
    }

    .toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      padding: 11px 16px;
      border-radius: 8px;
      font-size: 14px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      z-index: 1000;
    }

    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }

      .card-span-row {
        grid-column: 1;
      }
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-span-full {
        grid-column: 1;
      }
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
    this.errorMessage = '';
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = { ...this.profile, ...profile };
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.errorMessage = 'Failed to load profile.';
      }
    });
  }

  private updateProfile(): void {
    this.errorMessage = '';
    this.profileService.updateProfile(this.profile).subscribe({
      next: (updated) => {
        this.profile = { ...this.profile, ...updated };
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.authService.updateCurrentUser({
            ...currentUser,
            doctorProfile: this.profile
          });
        }
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
