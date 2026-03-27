import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-examination',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="view-page">
      <div class="page-header">
        <a routerLink="/doctor/examinations" class="back-link">← Back to History</a>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="downloadPDF()">📄 Download PDF</button>
        </div>
      </div>

      <div class="report-card">
        <div class="report-header">
          <div class="clinic-info">
            <h1>SkinCare Clinic</h1>
            <p>Dr. Ahmed Hassan</p>
            <p>123 Medical Center, Cairo</p>
          </div>
          <div class="report-meta">
            <p><strong>Examination ID:</strong> #{{ examId }}</p>
            <p><strong>Date:</strong> {{ exam.date }}</p>
          </div>
        </div>

        <div class="section patient-section">
          <h2>Patient Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <p>{{ exam.patientName }}</p>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <p>{{ exam.patientPhone }}</p>
            </div>
            <div class="info-item">
              <label>Age</label>
              <p>{{ exam.patientAge }} years</p>
            </div>
            <div class="info-item">
              <label>Reason for Visit</label>
              <p>{{ exam.reason }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Dermascope Images</h2>
          <div class="images-grid">
            <div *ngFor="let img of exam.images" class="image-item">
              <img [src]="img.url" alt="Dermascope image">
              <div class="image-ai" *ngIf="img.aiResult">
                AI: {{ img.aiResult }}
              </div>
            </div>
          </div>
        </div>

        <div class="section ai-section" *ngIf="exam.aiAnalysis">
          <h2>AI Analysis</h2>
          <div class="ai-result">
            <div class="ai-classification">
              <label>Classification</label>
              <h3>{{ exam.aiAnalysis.classification }}</h3>
            </div>
          </div>
        </div>

        <div class="section diagnosis-section">
          <h2>Diagnosis & Treatment</h2>
          <div class="diagnosis-content">
            <div class="diagnosis-item">
              <label>Diagnosis</label>
              <p>{{ exam.diagnosis }}</p>
            </div>
            <div class="diagnosis-item">
              <label>Treatment Plan</label>
              <p>{{ exam.treatment }}</p>
            </div>
            <div class="diagnosis-item">
              <label>Follow-up Instructions</label>
              <p>{{ exam.followUp }}</p>
            </div>
            <div class="diagnosis-row">
              <div class="diagnosis-item">
                <label>Risk Level</label>
                <span class="risk-badge" [class]="exam.riskLevel.toLowerCase()">{{ exam.riskLevel }}</span>
              </div>
              <div class="diagnosis-item" *ngIf="exam.followUpDate">
                <label>Follow-up Date</label>
                <p>{{ exam.followUpDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="report-footer">
          <p>This report was generated using SkinVision AI-Powered Dermatology Platform</p>
          <p class="disclaimer">AI analysis is advisory only. Clinical diagnosis by licensed physician.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .back-link {
      color: var(--text-light);
      text-decoration: none;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .report-card {
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      padding: 30px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
    }

    .clinic-info h1 {
      margin: 0 0 5px 0;
      font-size: 24px;
    }

    .clinic-info p {
      margin: 3px 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .report-meta {
      text-align: right;
      font-size: 14px;
    }

    .report-meta p {
      margin: 5px 0;
    }

    .section {
      padding: 25px 30px;
      border-bottom: 1px solid var(--border-color);
    }

    .section:last-of-type {
      border-bottom: none;
    }

    .section h2 {
      font-size: 16px;
      color: var(--primary-color);
      margin: 0 0 20px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-item label {
      display: block;
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .info-item p {
      margin: 0;
      color: var(--text-dark);
      font-weight: 500;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .image-item {
      border-radius: 8px;
      overflow: hidden;
      background: var(--background-color);
    }

    .image-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .image-ai {
      padding: 8px;
      background: var(--primary-color);
      color: white;
      font-size: 12px;
      text-align: center;
    }

    .ai-classification h3 {
      margin: 5px 0 0 0;
      color: var(--primary-color);
      font-size: 20px;
    }

    .diagnosis-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .diagnosis-item label {
      display: block;
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 8px;
    }

    .diagnosis-item p {
      margin: 0;
      color: var(--text-dark);
      line-height: 1.6;
    }

    .diagnosis-row {
      display: flex;
      gap: 40px;
    }

    .risk-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 15px;
      font-size: 14px;
      font-weight: 500;
    }

    .risk-badge.low { background: #d4edda; color: #155724; }
    .risk-badge.medium { background: #fff3cd; color: #856404; }
    .risk-badge.high { background: #f8d7da; color: #721c24; }

    .report-footer {
      padding: 20px 30px;
      background: var(--background-color);
      text-align: center;
    }

    .report-footer p {
      margin: 5px 0;
      font-size: 13px;
      color: var(--text-light);
    }

    .disclaimer {
      font-style: italic;
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .images-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .ai-result {
        flex-direction: column;
        gap: 20px;
      }
    }
  `]
})
export class ViewExaminationComponent implements OnInit {
  examId: string = '';

  exam = {
    date: 'January 26, 2026 - 10:30 AM',
    patientName: 'Mohamed Ali',
    patientPhone: '0101234567',
    patientAge: 35,
    reason: 'Skin rash on right arm',
    images: [
      { url: 'https://via.placeholder.com/300x200?text=Dermascope+1', aiResult: 'Contact Dermatitis' },
      { url: 'https://via.placeholder.com/300x200?text=Dermascope+2', aiResult: null }
    ],
    aiAnalysis: {
      classification: 'Contact Dermatitis'
    },
    diagnosis: 'Contact Dermatitis - likely caused by exposure to irritant substance. Mild inflammation observed with no signs of infection.',
    treatment: '1. Apply hydrocortisone cream 1% twice daily for 7 days\n2. Avoid contact with suspected irritants\n3. Use fragrance-free moisturizer',
    followUp: 'Return if symptoms worsen or do not improve within 2 weeks. Discontinue cream use after 7 days.',
    riskLevel: 'Low',
    followUpDate: 'February 9, 2026'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['id'];
  }

  downloadPDF() {
    alert('Downloading PDF report...');
  }
}
