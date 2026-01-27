import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="profile-container">
      <div class="card">
        <div class="page-header">
          <h1>My Profile</h1>
          <p class="subtitle">Update your personal and medical information</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <!-- Personal Information -->
          <div class="form-section">
            <h3>Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" [(ngModel)]="profileData.fullName" name="fullName" required>
              </div>

              <div class="form-group">
                <label>Email *</label>
                <input type="email" [(ngModel)]="profileData.email" name="email" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date of Birth *</label>
                <input type="date" [(ngModel)]="profileData.dateOfBirth" name="dateOfBirth" required>
              </div>

              <div class="form-group">
                <label>Gender</label>
                <select [(ngModel)]="profileData.gender" name="gender">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" [(ngModel)]="profileData.phone" name="phone" 
                       placeholder="+1 (555) 000-0000">
              </div>

              <div class="form-group">
                <label>Skin Type</label>
                <select [(ngModel)]="profileData.skinType" name="skinType">
                  <option value="">Select</option>
                  <option value="Type I">Type I - Very Fair</option>
                  <option value="Type II">Type II - Fair</option>
                  <option value="Type III">Type III - Medium</option>
                  <option value="Type IV">Type IV - Olive</option>
                  <option value="Type V">Type V - Brown</option>
                  <option value="Type VI">Type VI - Dark Brown/Black</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Medical History (FR-2.2) -->
          <div class="form-section">
            <h3>Medical History</h3>
            <p class="helper-text">This information helps doctors provide better diagnosis</p>

            <div class="form-group">
              <label>Allergies</label>
              <textarea [(ngModel)]="profileData.allergies" name="allergies" rows="2"
                        placeholder="List any allergies (medications, food, etc.)"></textarea>
            </div>

            <div class="form-group">
              <label>Current Medications</label>
              <textarea [(ngModel)]="profileData.medications" name="medications" rows="2"
                        placeholder="List any medications you're currently taking"></textarea>
            </div>

            <div class="form-group">
              <label>Previous Skin Conditions</label>
              <textarea [(ngModel)]="profileData.previousConditions" name="previousConditions" rows="3"
                        placeholder="Describe any previous skin conditions or treatments"></textarea>
            </div>

            <div class="form-group">
              <label>Family History</label>
              <textarea [(ngModel)]="profileData.familyHistory" name="familyHistory" rows="2"
                        placeholder="Any family history of skin conditions or cancer"></textarea>
            </div>

            <div class="checkbox-group">
              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="profileData.smokingHistory" name="smokingHistory">
                Smoking history
              </label>
              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="profileData.sunExposure" name="sunExposure">
                Frequent sun exposure
              </label>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="form-section">
            <h3>Emergency Contact (Optional)</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Contact Name</label>
                <input type="text" [(ngModel)]="profileData.emergencyName" name="emergencyName">
              </div>

              <div class="form-group">
                <label>Contact Phone</label>
                <input type="tel" [(ngModel)]="profileData.emergencyPhone" name="emergencyPhone">
              </div>
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="form-actions">
            <a routerLink="/patient" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin-bottom: 5px;
    }

    .subtitle {
      color: var(--text-light);
      margin: 0;
    }

    .form-section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      color: var(--primary-color);
      margin-bottom: 15px;
      font-size: 18px;
    }

    .helper-text {
      font-size: 14px;
      color: var(--text-light);
      margin-bottom: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .checkbox-group {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox input {
      width: auto;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientProfileComponent {
  profileData = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    dateOfBirth: '1990-01-15',
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    skinType: 'Type II',
    allergies: 'Penicillin',
    medications: '',
    previousConditions: '',
    familyHistory: '',
    smokingHistory: false,
    sunExposure: true,
    emergencyName: '',
    emergencyPhone: ''
  };

  onSubmit() {
    console.log('Profile updated:', this.profileData);
    // TODO: Implement profile update API call
  }
}

