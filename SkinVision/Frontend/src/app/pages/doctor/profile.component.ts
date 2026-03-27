import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="profile.fullName">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="profile.email">
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
              <label>Working Hours</label>
              <input type="text" [(ngModel)]="profile.workingHours" placeholder="e.g., Sun-Thu 9AM-5PM">
            </div>
            <div class="form-group">
              <label>Consultation Fee (EGP)</label>
              <input type="number" [(ngModel)]="profile.consultationFee">
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
  `]
})
export class DoctorProfileComponent {
  profile = {
    fullName: 'Dr. Ahmed Hassan',
    email: 'dr.ahmed@skinvision.com',
    phone: '01012345678',
    clinicName: 'SkinCare Clinic',
    clinicAddress: '123 Medical Center, Nasr City, Cairo',
    workingHours: 'Sun-Thu 9AM-5PM',
    consultationFee: 500
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  savePersonal() {
    alert('Personal information saved');
  }

  saveClinic() {
    alert('Clinic information saved');
  }

  changePassword() {
    if (this.password.new !== this.password.confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated');
    this.password = { current: '', new: '', confirm: '' };
  }
}
