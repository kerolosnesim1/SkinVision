import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-review',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="review-container">
      <div class="page-header">
        <div>
          <h1>Review Case #{{ caseData.id }}</h1>
          <span class="priority-badge" [class]="'priority-' + caseData.priority">
            {{ caseData.priority }} Priority
          </span>
        </div>
        <div class="header-actions">
          <select [(ngModel)]="caseData.status" class="status-select" (ngModelChange)="updateStatus()">
            <option value="Assigned">Assigned</option>
            <option value="InReview">In Review</option>
            <option value="AdditionalImagesRequested">Request More Images</option>
            <option value="Completed">Completed</option>
          </select>
          <a routerLink="/doctor" class="btn btn-secondary">← Back</a>
        </div>
      </div>

      <div class="review-content">
        <!-- Left Column: Patient Info & Images -->
        <div class="left-column">
          <!-- Patient Information -->
          <div class="card section">
            <h2>Patient Information</h2>
            <div class="patient-info">
              <div class="info-row">
                <label>Name:</label>
                <span>{{ caseData.patientName }}</span>
              </div>
              <div class="info-row">
                <label>Age:</label>
                <span>{{ caseData.patientAge }} years</span>
              </div>
              <div class="info-row">
                <label>Gender:</label>
                <span>{{ caseData.patientGender }}</span>
              </div>
              <div class="info-row">
                <label>Skin Type:</label>
                <span>{{ caseData.skinType }}</span>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="card section">
            <h2>Medical History</h2>
            <div class="medical-history">
              <div class="history-item">
                <label>Allergies:</label>
                <p>{{ caseData.allergies || 'None reported' }}</p>
              </div>
              <div class="history-item">
                <label>Current Medications:</label>
                <p>{{ caseData.medications || 'None' }}</p>
              </div>
              <div class="history-item">
                <label>Previous Conditions:</label>
                <p>{{ caseData.previousConditions || 'None' }}</p>
              </div>
              <div class="history-item">
                <label>Family History:</label>
                <p>{{ caseData.familyHistory || 'None' }}</p>
              </div>
            </div>
          </div>

          <!-- Case Details -->
          <div class="card section">
            <h2>Case Details</h2>
            <div class="case-details">
              <div class="detail-item">
                <label>Submitted:</label>
                <span>{{ caseData.submittedDate }}</span>
              </div>
              <div class="detail-item">
                <label>Affected Area:</label>
                <span>{{ caseData.affectedArea }}</span>
              </div>
              <div class="detail-item">
                <label>Duration:</label>
                <span>{{ caseData.duration }}</span>
              </div>
              <div class="detail-item full-width">
                <label>Description:</label>
                <p>{{ caseData.description }}</p>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="card section">
            <h2>Images ({{ caseData.images.length }})</h2>
            <div class="image-gallery">
              <div *ngFor="let image of caseData.images" class="gallery-item" (click)="viewImage(image)">
                <img [src]="image.url" [alt]="image.name">
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: AI Analysis & Diagnosis -->
        <div class="right-column">
          <!-- AI Analysis -->
          <div class="card section ai-section">
            <div class="section-header">
              <h2>🤖 AI Analysis</h2>
              <div class="ai-actions">
                <label class="btn btn-outline btn-sm upload-btn">
                  📷 Upload Image
                  <input type="file" accept="image/*" (change)="uploadImage($event)" hidden>
                </label>
                <button class="btn btn-secondary btn-sm" 
                        (click)="triggerAI()" 
                        [disabled]="aiLoading">
                  {{ aiLoading ? 'Analyzing...' : (aiResult ? 'Re-run Analysis' : 'Run AI Analysis') }}
                </button>
              </div>
            </div>

            <div *ngIf="!aiResult && !aiLoading" class="ai-prompt">
              <p>Click the button above to run AI-assisted analysis on this case.</p>
            </div>

            <div *ngIf="aiLoading" class="ai-loading">
              <div class="spinner"></div>
              <p>AI model is analyzing the images...</p>
            </div>

            <div *ngIf="aiResult" class="ai-result">
              <div class="ai-classification">
                <label>Classification:</label>
                <h3>{{ aiResult.classification }}</h3>
              </div>

              <div class="ai-confidence">
                <label>Confidence Score:</label>
                <div class="confidence-bar">
                  <div class="confidence-fill" [style.width.%]="aiResult.confidence"></div>
                </div>
                <span class="confidence-value">{{ aiResult.confidence }}%</span>
              </div>

              <div class="ai-findings">
                <label>Key Findings:</label>
                <ul>
                  <li *ngFor="let finding of aiResult.findings">{{ finding }}</li>
                </ul>
              </div>

              <div class="ai-note">
                <strong>Note:</strong> AI analysis is for reference only. Doctor's clinical judgment is required.
              </div>
            </div>
          </div>

          <!-- Diagnosis Form -->
          <div class="card section diagnosis-section">
            <h2>📋 Diagnosis & Treatment Plan</h2>

            <form (ngSubmit)="submitDiagnosis()">
              <div class="form-group">
                <label>Diagnosis *</label>
                <textarea [(ngModel)]="diagnosis.findings" name="findings" rows="4"
                          placeholder="Enter your diagnosis based on clinical examination and AI analysis..." required></textarea>
              </div>

              <div class="form-group">
                <label>Treatment Plan *</label>
                <textarea [(ngModel)]="diagnosis.treatment" name="treatment" rows="4"
                          placeholder="Recommended treatment plan..." required></textarea>
              </div>

              <div class="form-group">
                <label>Follow-up Instructions *</label>
                <textarea [(ngModel)]="diagnosis.followUp" name="followUp" rows="3"
                          placeholder="Follow-up recommendations..." required></textarea>
              </div>

              <div class="form-group">
                <label>Risk Level</label>
                <select [(ngModel)]="diagnosis.riskLevel" name="riskLevel">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">
                  Submit Diagnosis
                </button>
                <button type="button" class="btn btn-secondary" (click)="generatePDF()">
                  📄 Generate PDF Report
                </button>
              </div>
            </form>
          </div>

          <!-- Quick Actions -->
          <div class="card section">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
              <button class="action-btn" (click)="requestMoreImages()">
                📷 Request Additional Images
              </button>
              <button class="action-btn" (click)="generatePDF()">
                📄 Generate PDF Report
              </button>
              <button class="action-btn" (click)="markAsUrgent()">
                ⚠️ Mark as Urgent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 0 10px 0 0;
      display: inline-block;
    }

    .priority-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
    }

    .priority-high { background: #ffebee; color: #c62828; }
    .priority-medium { background: #fff3e0; color: #e65100; }
    .priority-low { background: #e8f5e9; color: #2e7d32; }

    .header-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .status-select {
      padding: 8px 16px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-weight: 500;
    }

    .review-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .left-column, .right-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section {
      margin: 0;
    }

    .section h2, .section h3 {
      color: var(--primary-color);
      margin: 0 0 20px 0;
      font-size: 18px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin: 0;
    }

    .ai-actions {
      display: flex;
      gap: 10px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: var(--primary-color);
      color: white;
    }

    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .patient-info, .case-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row, .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .info-row:last-child, .detail-item:last-child {
      border-bottom: none;
    }

    .info-row label, .detail-item label {
      font-weight: 600;
      color: var(--text-dark);
    }

    .full-width {
      flex-direction: column;
      gap: 8px;
    }

    .full-width p {
      margin: 0;
      line-height: 1.6;
    }

    .medical-history {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .history-item label {
      display: block;
      font-weight: 600;
      margin-bottom: 5px;
      color: var(--text-dark);
    }

    .history-item p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-dark);
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .gallery-item {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .gallery-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .ai-section {
      background: linear-gradient(135deg, var(--background-color) 0%, var(--white) 100%);
    }

    .ai-prompt {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    .ai-loading {
      text-align: center;
      padding: 40px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .ai-result {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .ai-classification h3 {
      margin: 8px 0 0 0;
      color: var(--primary-color);
      font-size: 20px;
    }

    .ai-confidence label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .confidence-bar {
      height: 12px;
      background: var(--border-color);
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .confidence-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      transition: width 0.5s ease;
    }

    .confidence-value {
      font-weight: 600;
      color: var(--primary-color);
    }

    .ai-findings ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .ai-findings li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .ai-note {
      padding: 12px;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      font-size: 14px;
    }

    .diagnosis-section {
      background: var(--white);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .form-actions button {
      flex: 1;
      min-width: 150px;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .action-btn {
      padding: 12px;
      background: var(--white);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: var(--background-color);
      border-color: var(--primary-color);
    }

    @media (max-width: 1200px) {
      .review-content {
        grid-template-columns: 1fr;
      }

      .image-gallery {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class CaseReviewComponent implements OnInit {
  caseId: string = '';
  aiLoading = false;
  aiResult: any = null;

  caseData = {
    id: '1234',
    status: 'InReview',
    priority: 'high',
    patientName: 'Jane Smith',
    patientAge: 45,
    patientGender: 'Female',
    skinType: 'Type II - Fair',
    allergies: 'Penicillin',
    medications: 'None',
    previousConditions: 'Eczema (treated 2 years ago)',
    familyHistory: 'Mother had melanoma at age 60',
    submittedDate: '2024-12-20',
    affectedArea: 'Left Arm',
    duration: '2-4 weeks',
    description: 'I noticed a dark mole on my left arm that has been growing slowly over the past few weeks. It has irregular borders and seems to be getting darker. No pain or itching, but I\'m concerned about the changes.',
    images: [
      { url: 'https://via.placeholder.com/400x300/167D7E/ffffff?text=Image+1', name: 'Overview' },
      { url: 'https://via.placeholder.com/400x300/2BB1B8/ffffff?text=Image+2', name: 'Close-up' },
      { url: 'https://via.placeholder.com/400x300/F0F8F9/333333?text=Image+3', name: 'Side View' }
    ]
  };

  diagnosis = {
    findings: '',
    treatment: '',
    followUp: '',
    riskLevel: 'Medium'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.caseId = this.route.snapshot.params['id'] || '1234';
  }

  triggerAI() {
    this.aiLoading = true;

    // Simulate AI analysis
    setTimeout(() => {
      this.aiResult = {
        classification: 'Atypical Nevus (Dysplastic Mole)',
        confidence: 87,
        findings: [
          'Asymmetrical shape detected',
          'Border irregularity present',
          'Color variation observed (light to dark brown)',
          'Diameter approximately 6mm',
          'Recent evolution noted'
        ],
        recommendation: 'Recommend biopsy for definitive diagnosis',
        modelVersion: 'SkinVision AI v2.1'
      };
      this.aiLoading = false;
    }, 2500);
  }

  updateStatus() {
    alert(`Case status updated to: ${this.caseData.status}`);
  }

  submitDiagnosis() {
    if (!this.isFormValid()) return;

    alert('Diagnosis submitted successfully!');
    this.router.navigate(['/doctor']);
  }

  generatePDF() {
    alert('PDF Report generated!');
  }

  requestMoreImages() {
    alert('Request sent to patient for additional images');
  }

  markAsUrgent() {
    this.caseData.priority = 'high';
    alert('Case marked as urgent');
  }

  viewImage(image: any) {
    alert('View image: ' + image.name);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Add the new image to the case
      const newImage = {
        url: URL.createObjectURL(file),
        name: file.name
      };
      this.caseData.images.push(newImage);
      alert(`Image "${file.name}" uploaded successfully! You can now run AI analysis on it.`);
      
      // Reset AI result so doctor can run analysis again with new image
      this.aiResult = null;
    }
  }

  isFormValid(): boolean {
    return this.diagnosis.findings.trim() !== '' &&
           this.diagnosis.treatment.trim() !== '' &&
           this.diagnosis.followUp.trim() !== '';
  }
}

