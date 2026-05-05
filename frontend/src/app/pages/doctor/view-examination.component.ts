import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExaminationService } from '../../services/examination.service';
import { ReportService } from '../../services/report.service';
import { Examination, Report, DoctorProfile } from '../../models/models';
import { environment } from '../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-view-examination',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="view-page">
      <div class="page-header">
        <a routerLink="/dashboard/examinations" class="back-link">← Back to History</a>
        <div class="header-actions">
          <button
            class="btn btn-primary"
            (click)="generateAndDownloadPDF()"
            id="download-report-btn">
            📄 Download PDF
          </button>
        </div>
      </div>

      <div class="error-state" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
        <a routerLink="/dashboard/examinations" class="btn btn-primary">Back to Examinations</a>
      </div>

      <div class="report-card" *ngIf="exam">
        <div class="report-header">
          <div class="clinic-info">
           <h1>{{ exam.doctor?.clinicName || 'SkinVision Clinic' }}</h1>
            <p>{{ exam.doctor?.fullName || 'Doctor' }}</p>
            <p>{{ exam.doctor?.clinicAddress || '' }}</p>
          </div>
          <div class="report-meta">
            <p><strong>Examination ID:</strong> #{{ examId }}</p>
            <p><strong>Date:</strong> {{ exam.createdAt | date:'MMMM dd, yyyy - hh:mm a' }}</p>
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
              <p>{{ exam.patientPhone || 'N/A' }}</p>
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

        <div class="section" *ngIf="exam.images && exam.images.length > 0">
          <h2>Dermascope Images</h2>
          <div class="images-grid">
            <div *ngFor="let img of exam.images" class="image-item">
              <img [src]="getImageUrl(img.filePath)" alt="Dermascope image">
              <div class="image-meta" *ngIf="img.bodyPart">
                {{ img.bodyPart }}
              </div>
              <div class="image-ai" *ngIf="img.aiResult">
                AI: {{ img.aiResult.classification }}
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
            <div class="ai-confidence" *ngIf="exam.aiAnalysis.confidenceScore">
              <label>Confidence</label>
              <h3>{{ (exam.aiAnalysis.confidenceScore * 100).toFixed(1) }}%</h3>
            </div>
          </div>
          <div class="ai-findings" *ngIf="exam.aiAnalysis.findings && exam.aiAnalysis.findings.length > 0">
            <label>Findings</label>
            <ul>
              <li *ngFor="let finding of exam.aiAnalysis.findings">{{ finding }}</li>
            </ul>
          </div>
        </div>

        <div class="section diagnosis-section">
          <h2>Diagnosis & Treatment</h2>
          <div class="diagnosis-content">
            <div class="diagnosis-item" *ngIf="exam.diagnosis">
              <label>Diagnosis</label>
              <p>{{ exam.diagnosis }}</p>
            </div>
            <div class="diagnosis-item" *ngIf="exam.treatment">
              <label>Treatment Plan</label>
              <p>{{ exam.treatment }}</p>
            </div>
            <div class="diagnosis-item" *ngIf="exam.followUp">
              <label>Follow-up Instructions</label>
              <p>{{ exam.followUp }}</p>
            </div>
            <div class="diagnosis-row">
              <div class="diagnosis-item" *ngIf="exam.riskLevel">
                <label>Risk Level</label>
                <span class="risk-badge" [class]="exam.riskLevel.toLowerCase()">{{ exam.riskLevel }}</span>
              </div>
              <div class="diagnosis-item" *ngIf="exam.followUpDate">
                <label>Follow-up Date</label>
                <p>{{ exam.followUpDate | date:'MMMM dd, yyyy' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Previous Reports Section -->
        <div class="section reports-section" *ngIf="reports.length > 0">
          <h2>Generated Reports</h2>
          <div class="reports-list">
            <div class="report-item" *ngFor="let report of reports">
              <div class="report-info">
                <span class="report-icon">📄</span>
                <div>
                  <p class="report-title">{{ report.title }}</p>
                  <p class="report-date">{{ report.createdAt | date:'MMM dd, yyyy - hh:mm a' }}</p>
                </div>
              </div>
              <div class="report-actions">
                <button class="btn-icon" (click)="downloadExistingReport(report)" title="Download">⬇️</button>
                <button class="btn-icon btn-icon-danger" (click)="deleteReport(report)" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <div class="report-footer">
          <p>This report was generated using SkinVision AI-Powered Dermatology Platform</p>
          <p class="disclaimer">AI analysis is advisory only. Clinical diagnosis by licensed physician.</p>
        </div>
      </div>

      <!-- Success Toast -->
      <div class="toast" *ngIf="toastMessage" [class.show]="toastMessage">
        {{ toastMessage }}
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
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--primary-color);
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .error-state {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-light);
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

    .image-meta {
      padding: 6px 8px;
      font-size: 11px;
      color: var(--text-light);
      text-align: center;
    }

    .image-ai {
      padding: 8px;
      background: var(--primary-color);
      color: white;
      font-size: 12px;
      text-align: center;
    }

    .ai-result {
      display: flex;
      gap: 40px;
    }

    .ai-classification h3, .ai-confidence h3 {
      margin: 5px 0 0 0;
      color: var(--primary-color);
      font-size: 20px;
    }

    .ai-findings {
      margin-top: 16px;
    }

    .ai-findings label {
      font-size: 12px;
      color: var(--text-light);
    }

    .ai-findings ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .ai-findings li {
      margin-bottom: 4px;
      color: var(--text-dark);
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
      white-space: pre-line;
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

    /* Reports List */
    .reports-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .report-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--background-color);
      border-radius: 8px;
      transition: background 0.2s;
    }

    .report-item:hover {
      background: #e8f5e9;
    }

    .report-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .report-icon {
      font-size: 24px;
    }

    .report-title {
      margin: 0;
      font-weight: 500;
      color: var(--text-dark);
      font-size: 14px;
    }

    .report-date {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--text-light);
    }

    .report-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .btn-icon:hover {
      background: rgba(0,0,0,0.08);
    }

    .btn-icon-danger:hover {
      background: #f8d7da;
    }

    /* Footer */
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

    /* Toast */
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--primary-color);
      color: white;
      padding: 14px 24px;
      border-radius: 10px;
      font-size: 14px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
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

      .report-header {
        flex-direction: column;
        gap: 16px;
      }

      .report-meta {
        text-align: left;
      }
    }
  `]
})
export class ViewExaminationComponent implements OnInit, OnDestroy {
  examId: string = '';
  exam: Examination | null = null;
  doctorProfile: DoctorProfile | null = null;
  reports: Report[] = [];
  private pdfBusy = false;
  errorMessage = '';
  toastMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private examinationService: ExaminationService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamination();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExamination() {
    this.examinationService.getExamination(+this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exam) => {
          this.exam = exam;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load examination.';
          this.cdr.detectChanges()
        }
      });
  }

  loadReports() {
    this.reportService.getReportsForExamination(+this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reports) => {
          this.reports = reports;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load reports.';
          this.cdr.detectChanges()
        }
      });
  }

  generateAndDownloadPDF() {
    if (this.pdfBusy) {
      return;
    }
    this.pdfBusy = true;
    this.reportService.generateReport(+this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report) => {
          this.reports.unshift(report);
          this.showToast('Report generated successfully!');

          this.reportService.downloadReport(report.reportId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (blob) => {
                this.triggerDownload(blob, `${report.title || 'Report'}.pdf`);
                this.pdfBusy = false;
              },
              error: () => {
                this.showToast('Report created but download failed. Try from the list below.');
                this.pdfBusy = false;
              }
            });
        },
        error: (err) => {
          this.showToast('Failed to generate report. Please try again.');
          this.pdfBusy = false;
          console.error(err);
        }
      });
  }

  downloadExistingReport(report: Report) {
    this.reportService.downloadReport(report.reportId).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `${report.title || 'Report'}.pdf`);
      },
      error: () => {
        this.showToast('Download failed. Please try again.');
      }
    });
  }

  deleteReport(report: Report) {
    if (!confirm('Are you sure you want to delete this report?')) return;

    this.reportService.deleteReport(report.reportId).subscribe({
      next: () => {
        this.reports = this.reports.filter(r => r.reportId !== report.reportId);
        this.showToast('Report deleted.');
      },
      error: () => {
        this.showToast('Failed to delete report.');
      }
    });
  }

  getImageUrl(filePath?: string): string {
    if (!filePath) return '';
    // The API serves static files from wwwroot
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${filePath}`;
  }

  private triggerDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
