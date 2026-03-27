import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-examination',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="examination-page">
      <div class="page-header">
        <a routerLink="/doctor" class="back-link">← Back to Dashboard</a>
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
                      [disabled]="!selectedImage || aiLoading">
                {{ aiLoading ? 'Analyzing...' : 'Analyze Image' }}
              </button>
            </div>

            <div *ngIf="!aiResult && !aiLoading" class="ai-empty">
              <p>Upload images and run AI analysis</p>
            </div>

            <div *ngIf="aiLoading" class="ai-loading">
              <div class="spinner"></div>
              <p>AI analyzing images...</p>
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
            
            <div class="form-group">
              <label>Diagnosis *</label>
              <textarea [(ngModel)]="exam.diagnosis" rows="3" 
                        placeholder="Enter your diagnosis..."></textarea>
            </div>

            <div class="form-group">
              <label>Treatment Plan *</label>
              <textarea [(ngModel)]="exam.treatment" rows="3" 
                        placeholder="Recommended treatment..."></textarea>
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
            <button class="btn btn-secondary" (click)="saveDraft()">Save Draft</button>
            <button class="btn btn-primary" (click)="complete()" [disabled]="!isValid()">
              Complete & Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .examination-page {
      max-width: 1400px;
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

    .exam-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .card {
      margin-bottom: 20px;
    }

    .card h2 {
      font-size: 18px;
      color: var(--text-dark);
      margin: 0 0 20px 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h2 {
      margin: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 10px;
      height: 300px;
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
      font-size: 48px;
      display: block;
      margin-bottom: 10px;
    }

    .upload-area p {
      margin: 0 0 5px 0;
      color: var(--text-dark);
    }

    .hint {
      font-size: 13px;
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
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(220, 53, 69, 0.9);
      color: white;
      border: none;
      font-size: 20px;
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
      padding: 10px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    .ai-empty, .ai-loading {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .ai-result {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .result-item label {
      display: block;
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .result-item h3 {
      margin: 0;
      color: var(--primary-color);
      font-size: 20px;
    }

    .result-item ul {
      margin: 0;
      padding-left: 20px;
    }

    .result-item li {
      margin-bottom: 5px;
      font-size: 14px;
    }

    .ai-note {
      padding: 12px;
      background: #fff3cd;
      border-radius: 8px;
      font-size: 13px;
      color: #856404;
    }

    .actions {
      display: flex;
      gap: 15px;
    }

    .actions button {
      flex: 1;
      padding: 14px;
    }

    .btn-sm {
      padding: 8px 14px;
      font-size: 13px;
    }

    @media (max-width: 1024px) {
      .exam-layout {
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

  selectedImage: { file: File, preview: string } | null = null;
  aiLoading = false;
  aiResult: any = null;

  constructor(private router: Router) { }

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

  analyze() {
    if (!this.selectedImage) return;

    this.aiLoading = true;
    setTimeout(() => {
      this.aiResult = {
        classification: 'Melanocytic Nevus',
        findings: [
          'Regular border pattern detected',
          'Uniform pigmentation',
          'Size within normal range',
          'No concerning features identified'
        ]
      };
      this.aiLoading = false;
    }, 2500);
  }

  isValid(): boolean {
    return this.exam.patientName.trim() !== '' &&
      this.exam.reason.trim() !== '' &&
      this.exam.diagnosis.trim() !== '' &&
      this.exam.treatment.trim() !== '';
  }

  saveDraft() {
    alert('Draft saved');
  }

  complete() {
    if (!this.isValid()) {
      alert('Please fill all required fields');
      return;
    }
    alert('Examination completed! Generating PDF report...');
    this.router.navigate(['/doctor']);
  }
}
