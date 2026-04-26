import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExaminationService } from '../../services/examination.service';
import { CreateExamination, UpdateExamination } from '../../models/models';

@Component({
  selector: 'app-new-examination',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="examination-page">
      <div class="page-header">
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        <h1>New Examination</h1>
      </div>

      <div class="exam-layout">
        <!-- Left: Patient Info & Images -->
        <div class="left-panel">
          <!-- Patient Info -->
          <div class="card">
            <h2>Patient Information</h2>
            <div class="form-row">
              <div class="form-group">
                <label>Patient Name *</label>
                <input type="text" [(ngModel)]="exam.patientName" placeholder="Full name">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="exam.patientPhone" placeholder="Phone number">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Age</label>
                <input type="number" [(ngModel)]="exam.patientAge" placeholder="Age">
              </div>
              <div class="form-group">
                <label>Reason for Visit *</label>
                <input type="text" [(ngModel)]="exam.reason" placeholder="e.g., Skin rash, mole check">
              </div>
            </div>
          </div>

          <!-- Dermascope Image -->
          <div class="card">
            <h2>Dermascope Image</h2>
            <div class="upload-area" (click)="imageInput.click()" [class.has-image]="selectedImage">
              <input #imageInput type="file" accept="image/*" (change)="onImageUpload($event)" hidden>
              
              <!-- Empty State -->
              <div class="upload-placeholder" *ngIf="!selectedImage">
                <span class="upload-icon">📷</span>
                <p>Click to capture or upload image</p>
                <span class="hint">JPEG, PNG (max 10MB)</span>
              </div>

              <!-- Image Preview -->
              <div class="image-preview" *ngIf="selectedImage">
                <img [src]="selectedImage.preview" alt="Dermascope image">
                <button class="remove-btn" (click)="removeImage($event)" title="Remove Image">×</button>
                <div class="ai-badge" *ngIf="aiResult">
                  {{ aiResult.classification }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: AI Results & Diagnosis -->
        <div class="right-panel">
          <!-- AI Analysis -->
          <div class="card">
            <div class="card-header">
              <h2>AI Analysis</h2>
              <button class="btn btn-secondary btn-sm" (click)="analyze()" 
                      [disabled]="!selectedImage">
                Analyze Image
              </button>
            </div>

            <div *ngIf="!aiResult" class="ai-empty">
              <p>Upload images and run AI analysis</p>
            </div>

            <div *ngIf="aiResult" class="ai-result">
              <div class="result-item">
                <label>Classification</label>
                <h3>{{ aiResult.classification }}</h3>
              </div>
              <div class="result-item">
                <label>Findings</label>
                <ul>
                  <li *ngFor="let finding of aiResult.findings">{{ finding }}</li>
                </ul>
              </div>
              <div class="ai-note">
                ⚠️ AI analysis is advisory. Clinical judgment required.
              </div>
            </div>
          </div>

          <!-- Diagnosis -->
          <div class="card">
            <h2>Diagnosis & Treatment</h2>

            <div class="form-row">
              <div class="form-group">
                <label>Diagnosis *</label>
                <textarea [(ngModel)]="exam.diagnosis" rows="2"
                          placeholder="Enter your diagnosis..."></textarea>
              </div>
              <div class="form-group">
                <label>Treatment Plan *</label>
                <textarea [(ngModel)]="exam.treatment" rows="2"
                          placeholder="Recommended treatment..."></textarea>
              </div>
            </div>

            <div class="form-group">
              <label>Follow-up Instructions</label>
              <textarea [(ngModel)]="exam.followUp" rows="2"
                        placeholder="Follow-up recommendations..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Risk Level *</label>
                <select [(ngModel)]="exam.riskLevel">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="form-group">
                <label>Follow-up Date</label>
                <input type="date" [(ngModel)]="exam.followUpDate">
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button class="btn btn-secondary" (click)="saveDraft()">
              Save Draft
            </button>
            <button class="btn btn-primary" (click)="complete()" [disabled]="!isValid()">
              Complete Examination
            </button>
          </div>
          <div *ngIf="errorMessage" class="error-text">{{ errorMessage }}</div>
        </div>
      </div>

      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
  styles: [`
    .examination-page {
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

    .exam-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: start;
    }

    .card {
      background: var(--white);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      margin-bottom: 16px;
    }

    .card h2 {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-dark);
      margin: 0 0 14px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .card-header h2 {
      margin: 0;
      font-size: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 16px;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group:last-child {
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
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 9px 12px;
      font-size: 14px;
      border-radius: 8px;
      border: 2px solid var(--border-color);
      font-family: inherit;
    }

    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 10px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      background: var(--background-color);
      transition: all 0.2s;
    }

    .upload-area:hover {
      border-color: var(--primary-color);
    }

    .upload-area.has-image {
      border-style: solid;
      padding: 0;
    }

    .upload-placeholder {
      text-align: center;
    }

    .upload-icon {
      font-size: 36px;
      display: block;
      margin-bottom: 8px;
    }

    .upload-area p {
      margin: 0 0 4px;
      color: var(--text-dark);
      font-size: 14px;
    }

    .hint {
      font-size: 12px;
      color: var(--text-light);
    }

    .image-preview {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(220, 53, 69, 0.9);
      color: white;
      border: none;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .remove-btn:hover {
      background: #dc3545;
    }

    .ai-badge {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
    }

    .ai-empty {
      text-align: center;
      padding: 28px 16px;
      color: var(--text-light);
      font-size: 14px;
    }

    .ai-result {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .result-item label {
      display: block;
      font-size: 11px;
      color: var(--text-light);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .result-item h3 {
      margin: 0;
      color: var(--primary-color);
      font-size: 17px;
    }

    .result-item ul {
      margin: 0;
      padding-left: 18px;
    }

    .result-item li {
      margin-bottom: 4px;
      font-size: 13px;
    }

    .ai-note {
      padding: 10px 12px;
      background: #fff3cd;
      border-radius: 8px;
      font-size: 12px;
      color: #856404;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .actions button {
      flex: 1;
      padding: 10px 16px;
      font-size: 14px;
    }

    .btn-sm {
      padding: 7px 12px;
      font-size: 12px;
    }

    .error-text {
      color: #b42318;
      margin-top: 10px;
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

    @media (max-width: 1024px) {
      .exam-layout {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .images-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class NewExaminationComponent {
  exam = {
    patientName: '',
    patientPhone: '',
    patientAge: null as number | null,
    reason: '',
    diagnosis: '',
    treatment: '',
    followUp: '',
    riskLevel: 'Low',
    followUpDate: ''
  };

  examinationId: number | null = null;
  selectedImage: { file: File, preview: string } | null = null;
  aiResult: any = null;
  errorMessage = '';
  toastMessage = '';

  private inFlight = false;

  constructor(
    private router: Router,
    private examinationService: ExaminationService
  ) { }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = {
          file: file,
          preview: e.target.result
        };
        this.aiResult = null; // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation(); // Prevent triggering file input
    this.selectedImage = null;
    this.aiResult = null;
  }

  analyze(): void {
    if (this.inFlight) {
      return;
    }
    if (!this.selectedImage) {
      return;
    }

    if (!this.examinationId) {
      this.showToast('Save draft first before analyzing image.');
      return;
    }

    this.inFlight = true;
    this.errorMessage = '';
    this.examinationService
      .uploadImage(this.examinationId, this.selectedImage.file)
      .subscribe({
        next: (image) => {
          this.aiResult = image.aiResult ?? null;
          this.inFlight = false;
          this.showToast('Image uploaded successfully');
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.errorMessage = 'Failed to upload/analyze image.';
          this.inFlight = false;
        }
      });
  }

  isValid(): boolean {
    return this.exam.patientName.trim() !== '' &&
      this.exam.reason.trim() !== '' &&
      this.exam.diagnosis.trim() !== '' &&
      this.exam.treatment.trim() !== '';
  }

  saveDraft(): void {
    if (this.inFlight) {
      return;
    }
    if (!this.exam.patientName.trim() || !this.exam.reason.trim()) {
      this.errorMessage = 'Patient name and reason are required to save draft.';
      return;
    }

    this.inFlight = true;
    this.errorMessage = '';

    if (!this.examinationId) {
      this.examinationService.createExamination(this.buildCreatePayload(0)).subscribe({
        next: (examination) => {
          this.examinationId = examination.diagnosisId;
          this.inFlight = false;
          this.showToast('Draft created');
        },
        error: (error) => {
          console.error('Error creating draft:', error);
          this.errorMessage = 'Failed to save draft.';
          this.inFlight = false;
        }
      });
      return;
    }

    this.examinationService.updateExamination(this.examinationId, this.buildUpdatePayload(0)).subscribe({
      next: () => {
        this.inFlight = false;
        this.showToast('Draft updated');
      },
      error: (error) => {
        console.error('Error updating draft:', error);
        this.errorMessage = 'Failed to update draft.';
        this.inFlight = false;
      }
    });
  }

  complete(): void {
    if (this.inFlight) {
      return;
    }
    if (!this.isValid()) {
      this.errorMessage = 'Please fill all required fields before completing.';
      return;
    }

    this.inFlight = true;
    this.errorMessage = '';

    if (!this.examinationId) {
      this.examinationService.createExamination(this.buildCreatePayload(1)).subscribe({
        next: (examination) => {
          this.inFlight = false;
          this.router.navigate(['/dashboard/examination', examination.diagnosisId]);
        },
        error: (error) => {
          console.error('Error completing examination:', error);
          this.errorMessage = 'Failed to complete examination.';
          this.inFlight = false;
        }
      });
      return;
    }

    this.examinationService.updateExamination(this.examinationId, this.buildUpdatePayload(1)).subscribe({
      next: (examination) => {
        this.inFlight = false;
        this.router.navigate(['/dashboard/examination', examination.diagnosisId]);
      },
      error: (error) => {
        console.error('Error completing examination:', error);
        this.errorMessage = 'Failed to complete examination.';
        this.inFlight = false;
      }
    });
  }

  private buildCreatePayload(status: number): CreateExamination {
    return {
      patientName: this.exam.patientName,
      patientPhone: this.exam.patientPhone || undefined,
      patientAge: this.exam.patientAge ?? undefined,
      reason: this.exam.reason,
      diagnosis: this.exam.diagnosis,
      treatment: this.exam.treatment,
      followUp: this.exam.followUp || undefined,
      riskLevel: this.exam.riskLevel,
      followUpDate: this.exam.followUpDate ? new Date(this.exam.followUpDate) : undefined,
      imageIds: [],
      status
    };
  }

  private buildUpdatePayload(status: number): UpdateExamination {
    return {
      diagnosis: this.exam.diagnosis || undefined,
      treatment: this.exam.treatment || undefined,
      followUp: this.exam.followUp || undefined,
      riskLevel: this.exam.riskLevel || undefined,
      followUpDate: this.exam.followUpDate ? new Date(this.exam.followUpDate) : undefined,
      status
    };
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}

