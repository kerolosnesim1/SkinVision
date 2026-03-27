import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
          <div *ngFor="let exam of recentExaminations" class="exam-card">
            <div class="exam-info">
              <h4>{{ exam.patientName }}</h4>
              <p class="reason">{{ exam.reason }}</p>
              <p class="date">{{ exam.date }}</p>
            </div>
            <div class="exam-meta">
              <span class="risk-badge" [class]="exam.riskLevel.toLowerCase()">
                {{ exam.riskLevel }}
              </span>
              <a [routerLink]="['/doctor/examination', exam.id]" class="btn btn-secondary btn-sm">
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
export class DoctorDashboardComponent {
  doctorName = 'Ahmed Hassan';
  clinicName = 'SkinCare Clinic, Cairo';

  stats = {
    total: 47,
    today: 5,
    aiAnalyses: 42
  };

  recentExaminations = [
    { id: '1', patientName: 'Mohamed Ali', reason: 'Skin rash on arm', date: 'Today, 10:30 AM', riskLevel: 'Low' },
    { id: '2', patientName: 'Fatma Hassan', reason: 'Mole examination', date: 'Today, 09:15 AM', riskLevel: 'Medium' },
    { id: '3', patientName: 'Ahmed Mahmoud', reason: 'Acne treatment follow-up', date: 'Yesterday', riskLevel: 'Low' },
    { id: '4', patientName: 'Sara Ibrahim', reason: 'Suspicious lesion', date: 'Yesterday', riskLevel: 'High' }
  ];
}
