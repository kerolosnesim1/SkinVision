import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

        <div class="card form-grid card-span-row">
          <h2>Connected Accounts</h2>
          <div class="form-span-full google-link-section">
            <div class="google-status">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div>
                <strong>Google Account</strong>
                <span *ngIf="googleLinked" class="status-badge linked">Linked</span>
                <span *ngIf="!googleLinked" class="status-badge not-linked">Not linked</span>
              </div>
            </div>
            <button *ngIf="!googleLinked" class="btn btn-outline" (click)="linkGoogle()">Link Google Account</button>
            <button *ngIf="googleLinked" class="btn btn-danger-outline" (click)="unlinkGoogle()">Unlink</button>
          </div>
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

    .google-link-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 10px;
      border: 1px solid #e5e5e5;
    }

    .google-status {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .google-status strong {
      display: block;
      font-size: 14px;
      color: #333;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.linked {
      color: #167D7E;
    }

    .status-badge.not-linked {
      color: #999;
    }

    .btn-outline {
      padding: 8px 16px;
      border: 2px solid #167D7E;
      background: transparent;
      color: #167D7E;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-outline:hover {
      background: #167D7E;
      color: white;
    }

    .btn-danger-outline {
      padding: 8px 16px;
      border: 2px solid #dc3545;
      background: transparent;
      color: #dc3545;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-danger-outline:hover {
      background: #dc3545;
      color: white;
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

  googleLinked = false;

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.email = currentUser?.email ?? '';
    this.loadProfile();

    // Handle query params from Google link redirect
    this.route.queryParams.subscribe(params => {
      if (params['linkSuccess']) {
        this.googleLinked = true;
        this.showToast('Google account linked successfully');
      }
      if (params['linkError']) {
        const error = params['linkError'];
        if (error === 'already_linked') {
          this.errorMessage = 'This Google account is already linked to another user.';
        } else {
          this.errorMessage = 'Failed to link Google account. Please try again.';
        }
      }
    });
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

  linkGoogle(): void {
    this.authService.linkGoogle();
  }

  unlinkGoogle(): void {
    this.authService.unlinkGoogle().subscribe({
      next: () => {
        this.googleLinked = false;
        this.showToast('Google account unlinked');
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to unlink Google account.';
      }
    });
  }
}
