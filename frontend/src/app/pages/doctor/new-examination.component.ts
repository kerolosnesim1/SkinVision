import { Component, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExaminationService } from '../../services/examination.service';
import { CreateExamination, UpdateExamination, Prediction } from '../../models/models';
import { environment } from '../../../environments/environment';

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
                <label>Lesion Location *</label>
                <select [(ngModel)]="exam.anatomSite" required>
                  <option value="">Select lesion location</option>
                  <option value="anterior torso">Anterior Torso</option>
                  <option value="head/neck">Head / Neck</option>
                  <option value="lower extremity">Lower Extremity</option>
                  <option value="oral/genital">Oral / Genital</option>
                  <option value="palms/soles">Palms / Soles</option>
                  <option value="posterior torso">Posterior Torso</option>
                  <option value="upper extremity">Upper Extremity</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Age *</label>
                <input type="number" [(ngModel)]="exam.patientAge" placeholder="Age" required>
              </div>
              <div class="form-group">
                <label>Gender *</label>
                <select [(ngModel)]="exam.sex" required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="exam.patientPhone" placeholder="Phone number">
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

              <!-- Image Preview (stays visible during upload) -->
              <div class="image-preview" *ngIf="selectedImage">
                <img [src]="selectedImage.preview" alt="Dermascope image">
                <button class="remove-btn" (click)="removeImage($event)" title="Remove Image" *ngIf="!uploading">×</button>
                <div class="ai-badge" *ngIf="aiResult">
                  {{ aiResult.classification }}
                </div>
                <div class="uploaded-badge" *ngIf="uploadedImageId && !uploading && !aiResult">
                  ✓ Uploaded
                </div>
              </div>
            </div>

            <!-- Upload Progress Bar (below the image card) -->
            <div class="upload-progress" *ngIf="uploading && uploadProgress >= 0">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="uploadProgress"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}% uploading...</span>
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
                      [disabled]="!canAnalyze()">
                {{ analyzing ? 'Analyzing...' : '🔬 Analyze Image' }}
              </button>
            </div>

            <div *ngIf="analyzing" class="loading-state">
              <div class="spinner"></div>
              <p>Running AI analysis...</p>
              <span class="loading-hint">This may take 5-15 seconds</span>
            </div>

            <div *ngIf="!aiResult && !analyzing && !aiError" class="ai-empty">
              <p *ngIf="!selectedImage">Upload an image to enable AI analysis</p>
              <p *ngIf="selectedImage && uploading">Image is uploading…</p>
              <p *ngIf="selectedImage && !uploading && !uploadedImageId && (!exam.patientName.trim() || !exam.anatomSite.trim())">Fill <strong>patient name</strong> & <strong>lesion location</strong> to upload the image</p>
              <p *ngIf="selectedImage && !uploading && !uploadedImageId && exam.patientName.trim() && exam.anatomSite.trim()">Click <strong>"Analyze Image"</strong> to upload & classify</p>
              <p *ngIf="uploadedImageId && !uploading">Image ready — click <strong>"🔬 Analyze Image"</strong> to classify</p>
            </div>

            <div *ngIf="aiError" class="ai-error">
              <p class="error-title">⚠️ AI Analysis Failed</p>
              <p>{{ aiError }}</p>
              <button class="btn btn-secondary btn-sm" (click)="retryAnalysis()">Retry</button>
            </div>

            <div *ngIf="aiResult" class="ai-result">
              <div class="result-item">
                <label>Classification</label>
                <h3>{{ aiResult.classification }}</h3>
              </div>
              <div class="result-item" *ngIf="aiResult.confidenceScore">
                <label>Confidence</label>
                <p>{{ (aiResult.confidenceScore * 100).toFixed(1) }}%</p>
              </div>
              <div class="result-item">
                <label>Findings</label>
                <ul>
                  <li *ngFor="let finding of aiResult.findings">{{ finding }}</li>
                </ul>
              </div>
              <div class="heatmap-section" *ngIf="aiResult.heatmapPath">
                <label>Explainable AI — Grad-CAM Heatmap</label>
                <p class="heatmap-description">The heatmap highlights regions that most influenced the AI classification.</p>
                <div class="heatmap-overlay-container">
                  <img class="heatmap-original" [src]="selectedImage!.preview" alt="Original image">
                  <img class="heatmap-overlay" [src]="getHeatmapUrl(aiResult.heatmapPath)" alt="Grad-CAM heatmap">
                </div>
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
      min-height: 220px;
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

    .upload-progress {
      padding: 12px 16px;
      background: var(--background-color);
      border-radius: 8px;
      margin-bottom: 8px;
      width: 100%;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 6px;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 12px;
      color: var(--text-light);
      text-align: center;
      display: block;
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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-preview img {
      width: 100%;
      max-height: 400px;
      object-fit: contain;
      border-radius: 8px;
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

    .uploaded-badge {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 7px;
      background: rgba(22, 163, 74, 0.92);
      color: white;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      letter-spacing: 0.3px;
    }

    .ai-empty {
      text-align: center;
      padding: 28px 16px;
      color: var(--text-light);
      font-size: 14px;
    }

    .ai-error {
      text-align: center;
      padding: 20px 16px;
      background: #fef2f2;
      border-radius: 10px;
      border: 1px solid #fecaca;
    }

    .ai-error .error-title {
      font-weight: 600;
      color: #b42318;
      margin: 0 0 6px;
      font-size: 14px;
    }

    .ai-error p {
      color: #991b1b;
      font-size: 13px;
      margin: 0 0 12px;
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

    .result-item p {
      margin: 0;
      font-size: 14px;
      color: var(--text-dark);
    }

    .result-item ul {
      margin: 0;
      padding-left: 18px;
    }

    .result-item li {
      margin-bottom: 4px;
      font-size: 13px;
    }

    .heatmap-section {
      margin-top: 14px;
    }

    .heatmap-section label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-color);
    }

    .heatmap-description {
      font-size: 12px;
      color: var(--text-light);
      margin: 4px 0 10px;
    }

    .heatmap-overlay-container {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid var(--border-color);
    }

    .heatmap-original {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .heatmap-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.5;
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
    }
  `]
})
export class NewExaminationComponent {
  exam = {
    patientName: '',
    patientPhone: '',
    patientAge: null as number | null,
    sex: '' as string,
    anatomSite: '' as string,
    diagnosis: '',
    treatment: '',
    followUp: '',
    riskLevel: 'Low',
    followUpDate: ''
  };

  examinationId: number | null = null;
  selectedImage: { file: File, preview: string } | null = null;
  uploadedImageId: number | null = null;
  aiResult: Prediction | null = null;
  aiError: string | null = null;
  uploading = false;
  analyzing = false;
  uploadProgress = -1;
  errorMessage = '';
  toastMessage = '';

  private inFlight = false;

  constructor(
    private router: Router,
    private examinationService: ExaminationService,
    private ngZone: NgZone
  ) { }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // URL.createObjectURL is instant — no async FileReader needed
    this.selectedImage = {
      file: file,
      preview: URL.createObjectURL(file)
    };
    this.aiResult = null;
    this.aiError = null;
    this.uploadedImageId = null;
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    if (this.selectedImage?.preview) {
      URL.revokeObjectURL(this.selectedImage.preview);
    }
    this.selectedImage = null;
    this.uploadedImageId = null;
    this.aiResult = null;
    this.aiError = null;
  }

  canAnalyze(): boolean {
    return !!this.selectedImage && !this.analyzing && !this.uploading;
  }

  /** Auto-create draft then upload image (used when user selects image before saving). */
  private autoSaveThenUpload(): void {
    if (!this.selectedImage || this.inFlight) {
      return;
    }

    this.inFlight = true;
    this.errorMessage = '';

    this.examinationService.createExamination(this.buildCreatePayload(0)).subscribe({
      next: (examination) => {
        this.examinationId = examination.diagnosisId;
        this.inFlight = false;
        this.showToast('Draft created');
        this.uploadImageImmediately();
      },
      error: (error) => {
        console.error('Error auto-saving draft:', error);
        this.errorMessage = 'Failed to save draft.';
        this.inFlight = false;
      }
    });
  }

  /** Upload image to server with progress bar (no AI analysis). */
  private uploadImageImmediately(): void {
    if (!this.examinationId || !this.selectedImage || this.uploading) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    this.examinationService
      .uploadImageOnlyWithProgress(this.examinationId, this.selectedImage.file)
      .subscribe({
        next: (data) => {
          this.uploadProgress = data.progress;
          if (data.result) {
            this.uploadedImageId = data.result.imageId;
            this.uploading = false;
            this.uploadProgress = -1;
            this.showToast('Image uploaded ✓');
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.errorMessage = 'Failed to upload image.';
          this.uploading = false;
          this.uploadProgress = -1;
        }
      });
  }

  analyze(): void {
    if (this.inFlight || !this.selectedImage) {
      return;
    }

    this.aiError = null;

    // Step 1: Need a draft first
    if (!this.examinationId) {
      this.autoSaveThenUploadThenAnalyze();
      return;
    }

    // Step 2: Need to upload the image first
    if (!this.uploadedImageId) {
      this.uploadThenAnalyze();
      return;
    }

    // Step 3: Image already uploaded — just analyze
    this.runAnalysis();
  }

  retryAnalysis(): void {
    this.aiError = null;
    this.analyze();
  }

  /** Auto-save draft → upload image → run analysis (all chained). */
  private autoSaveThenUploadThenAnalyze(): void {
    if (!this.exam.patientName.trim() || !this.exam.anatomSite.trim() || this.exam.patientAge === null || !this.exam.sex.trim()) {
      this.errorMessage = 'Patient name, age, gender, and lesion location are required before analysis.';
      return;
    }

    this.inFlight = true;
    this.analyzing = true;
    this.errorMessage = '';

    this.examinationService.createExamination(this.buildCreatePayload(0)).subscribe({
      next: (examination) => {
        this.examinationId = examination.diagnosisId;
        this.inFlight = false;
        this.showToast('Draft created automatically');
        this.uploadThenAnalyze();
      },
      error: (error) => {
        console.error('Error auto-saving draft:', error);
        this.errorMessage = 'Failed to save draft for analysis.';
        this.inFlight = false;
        this.analyzing = false;
      }
    });
  }

  /** Upload image with progress → then run analysis. */
  private uploadThenAnalyze(): void {
    if (!this.examinationId || !this.selectedImage) {
      return;
    }

    this.inFlight = true;
    this.uploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    this.examinationService
      .uploadImageOnlyWithProgress(this.examinationId, this.selectedImage.file)
      .subscribe({
        next: (data) => {
          this.uploadProgress = data.progress;
          if (data.result) {
            this.uploadedImageId = data.result.imageId;
            this.uploading = false;
            this.uploadProgress = -1;
            this.showToast('Image uploaded');
            this.inFlight = false;
            this.runAnalysis();
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.errorMessage = 'Failed to upload image.';
          this.uploading = false;
          this.analyzing = false;
          this.uploadProgress = -1;
          this.inFlight = false;
        }
      });
  }

  private runAnalysis(): void {
    if (!this.examinationId || !this.uploadedImageId) {
      return;
    }

    this.inFlight = true;
    this.analyzing = true;
    this.errorMessage = '';

    this.examinationService
      .analyzeImage(this.examinationId, this.uploadedImageId)
      .subscribe({
        next: (prediction) => {
          this.aiResult = prediction;
          this.aiError = null;
          this.analyzing = false;
          this.inFlight = false;
          this.showToast('AI analysis complete');
        },
        error: (error) => {
          console.error('Error analyzing image:', error);
          this.analyzing = false;
          this.inFlight = false;

          if (error.status === 503) {
            this.aiError = 'AI service is currently unavailable. Please try again later.';
          } else if (error.status === 500) {
            this.aiError = 'AI analysis encountered an internal error. Please try again.';
          } else if (error.status === 404) {
            this.aiError = 'Image not found. Please re-upload and try again.';
          } else {
            this.aiError = 'AI analysis failed. Please check that the ML service is running and try again.';
          }
        }
      });
  }

  isValid(): boolean {
    return this.exam.patientName.trim() !== '' &&
      this.exam.patientAge !== null && this.exam.patientAge >= 0 && this.exam.patientAge <= 120 &&
      this.exam.sex.trim() !== '' &&
      this.exam.anatomSite.trim() !== '' &&
      this.exam.diagnosis.trim() !== '' &&
      this.exam.treatment.trim() !== '';
  }

  saveDraft(): void {
    if (this.inFlight) {
      return;
    }
    if (!this.exam.patientName.trim() || !this.exam.anatomSite.trim() || this.exam.patientAge === null || !this.exam.sex.trim()) {
      this.errorMessage = 'Patient name, age, gender, and lesion location are required to save draft.';
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

          // Auto-upload pending image now that we have an examination ID
          if (this.selectedImage && !this.uploadedImageId) {
            this.uploadImageImmediately();
          }
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
      patientAge: this.exam.patientAge!,
      anatomSite: this.exam.anatomSite,
      sex: this.exam.sex,
      diagnosis: this.exam.diagnosis,
      treatment: this.exam.treatment,
      followUp: this.exam.followUp || undefined,
      riskLevel: this.exam.riskLevel,
      followUpDate: this.exam.followUpDate ? new Date(this.exam.followUpDate) : undefined,
      imageIds: this.uploadedImageId ? [this.uploadedImageId] : [],
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

  getHeatmapUrl(heatmapPath?: string): string {
    if (!heatmapPath) return '';
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${heatmapPath}`;
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
