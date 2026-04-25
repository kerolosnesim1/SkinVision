import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExaminationService } from '../../services/examination.service';
import { AuthService } from '../../services/auth.service';
import { Examination, ExaminationStats, ExaminationListItem } from '../../models/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Welcome, Dr. {{ doctorName }}</h1>
          <p class="subtitle">{{ clinicName }}</p>
        </div>
        <a routerLink="/doctor/examination/new" class="btn btn-primary btn-large">
          + New Examination
        </a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>{{ stats.total }}</h3>
            <p>Total Examinations</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>{{ stats.today }}</h3>
            <p>Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🤖</div>
          <div class="stat-content">
            <h3>{{ stats.aiAnalyses }}</h3>
            <p>AI Analyses</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Recent Examinations</h2>
          <a routerLink="/doctor/examinations" class="link">View All</a>
        </div>

        <div class="examinations-list">
          <div *ngIf="isLoading" class="empty-state">
            <p>Loading examinations...</p>
          </div>
          <div *ngIf="errorMessage" class="empty-state">
            <p>{{ errorMessage }}</p>
          </div>
          
          <div *ngIf="!isLoading && !errorMessage">
            <div *ngFor="let exam of recentExaminations" class="exam-card">
              <div class="exam-info">
                <h4>{{ exam.patientName }}</h4>
                <p class="reason">{{ exam.reason }}</p>
                <p class="date">{{ exam.createdAt | date:'mediumDate' }}</p>
              </div>
              <div class="exam-meta">
                <span class="risk-badge" [class]="exam.riskLevel?.toLowerCase() || 'low'">
                  {{ exam.riskLevel || 'Low' }}
                </span>
                <a [routerLink]="['/doctor/examination', exam.diagnosisId]" class="btn btn-secondary btn-sm">
                  View
                </a>
              </div>
            </div>

            <div *ngIf="recentExaminations.length === 0" class="empty-state">
              <p>No examinations yet</p>
              <a routerLink="/doctor/examination/new" class="btn btn-primary">
                Start Your First Examination
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1100px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      color: var(--primary-color);
      margin: 0 0 5px 0;
    }

    .subtitle {
      color: var(--text-light);
      margin: 0;
    }

    .btn-large {
      padding: 14px 28px;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: var(--white);
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .stat-icon {
      width: 55px;
      height: 55px;
      background: var(--background-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 32px;
      color: var(--primary-color);
    }

    .stat-content p {
      margin: 0;
      color: var(--text-light);
      font-size: 14px;
    }

    .section {
      background: var(--white);
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 20px;
      color: var(--text-dark);
    }

    .link {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 14px;
    }

    .examinations-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .exam-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: var(--background-color);
      border-radius: 10px;
      transition: all 0.2s;
    }

    .exam-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .exam-info h4 {
      margin: 0 0 5px 0;
      color: var(--text-dark);
    }

    .exam-info .reason {
      margin: 0 0 5px 0;
      color: var(--text-light);
      font-size: 14px;
    }

    .exam-info .date {
      margin: 0;
      color: var(--text-light);
      font-size: 13px;
    }

    .exam-meta {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .risk-badge {
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 500;
    }

    .risk-badge.low {
      background: #d4edda;
      color: #155724;
    }

    .risk-badge.medium {
      background: #fff3cd;
      color: #856404;
    }

    .risk-badge.high {
      background: #f8d7da;
      color: #721c24;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 13px;
    }

    .empty-state {
      text-align: center;
      padding: 50px 20px;
      color: var(--text-light);
    }

    .empty-state p {
      margin-bottom: 20px;
    }

    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 20px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  doctorName = '';
  clinicName = '';
  stats: ExaminationStats = { total: 0, today: 0, aiAnalyses: 0 };
  recentExaminations: ExaminationListItem[] = [];
  isLoading = true;
  errorMessage = '';
  toastMessage = '';

  constructor(
    private examinationService: ExaminationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.getStats();
    this.getRecentExaminations();
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.doctorProfile) {
      this.doctorName = currentUser.doctorProfile.fullName || 'Doctor';
      this.clinicName = currentUser.doctorProfile.clinicName || 'Clinic';
    } else {
      this.doctorName = 'Doctor';
      this.clinicName = 'Clinic';
    }
  }

  private getStats(): void {
    this.examinationService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
        this.showToast('Could not load dashboard stats');
      }
    });
  }

  private getRecentExaminations(): void {
    this.examinationService.getExaminations().subscribe({
      next: (examinations) => {
        // Take only the first 5 examinations for recent list
        this.recentExaminations = examinations.slice(0, 5);
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Failed to load examinations:', error);
        this.errorMessage = 'Failed to load recent examinations.';
        this.isLoading = false;
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