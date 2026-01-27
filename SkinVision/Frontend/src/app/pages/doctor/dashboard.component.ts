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
        <h1>Doctor Dashboard</h1>
        <div class="status-badge">Active</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning);">📋</div>
          <div class="stat-content">
            <h3>{{ stats.queueCount }}</h3>
            <p>Current Queue</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info);">👁️</div>
          <div class="stat-content">
            <h3>{{ stats.inReview }}</h3>
            <p>In Review</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success);">✓</div>
          <div class="stat-content">
            <h3>{{ stats.completedToday }}</h3>
            <p>Completed Today</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-color);">📊</div>
          <div class="stat-content">
            <h3>{{ stats.totalCompleted }}</h3>
            <p>Total Cases</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <div class="section-header">
            <h2>Assigned Cases Queue</h2>
            <a routerLink="/doctor/cases" class="link">View All</a>
          </div>

          <div class="cases-list">
            <div *ngFor="let case of assignedCases" class="case-card">
              <div class="case-header">
                <div>
                  <span class="case-id">Case #{{ case.id }}</span>
                  <span class="priority-badge" [class]="'priority-' + case.priority">
                    {{ case.priority }} Priority
                  </span>
                </div>
                <span class="case-status" [class]="'status-' + case.status.toLowerCase()">
                  {{ case.status }}
                </span>
              </div>

              <div class="case-body">
                <p class="patient-info">
                  <strong>Patient:</strong> {{ case.patientName }} | <strong>Age:</strong> {{ case.age }}
                </p>
                <p class="case-description">{{ case.description }}</p>
                <div class="case-meta">
                  <span>📅 {{ case.assignedDate }}</span>
                  <span>📷 {{ case.imageCount }} images</span>
                </div>
              </div>

              <div class="case-footer">
                <a [routerLink]="['/doctor/case', case.id]" class="btn btn-primary btn-sm">
                  Review Case
                </a>
              </div>
            </div>

            <div *ngIf="assignedCases.length === 0" class="empty-state">
              <p>No cases in your queue</p>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="section">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
              <a routerLink="/doctor/cases" class="action-btn">
                <span class="action-icon">📁</span>
                <span>View All Cases</span>
              </a>
              <button class="action-btn" (click)="toggleAvailability()">
                <span class="action-icon">{{ isAvailable ? '⏸️' : '▶️' }}</span>
                <span>{{ isAvailable ? 'Go Offline' : 'Go Online' }}</span>
              </button>
            </div>
          </div>

          <div class="section">
            <h3>Today's Summary</h3>
            <div class="summary-list">
              <div class="summary-item">
                <span>Cases Reviewed</span>
                <strong>{{ stats.completedToday }}</strong>
              </div>
              <div class="summary-item">
                <span>Avg Review Time</span>
                <strong>15 min</strong>
              </div>
              <div class="summary-item">
                <span>AI Analyses Triggered</span>
                <strong>{{ stats.aiTriggered }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      color: var(--primary-color);
      margin: 0;
    }

    .status-badge {
      padding: 8px 20px;
      background: var(--success);
      color: var(--white);
      border-radius: 20px;
      font-weight: 500;
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: var(--white);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 28px;
      color: var(--text-dark);
    }

    .stat-content p {
      margin: 0;
      color: var(--text-light);
      font-size: 14px;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    .section {
      background: var(--white);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: var(--text-dark);
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

    .cases-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .case-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 15px;
    }

    .case-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .case-id {
      font-weight: 600;
      color: var(--primary-color);
      margin-right: 10px;
    }

    .priority-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }

    .priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-medium {
      background: #fff3e0;
      color: #e65100;
    }

    .priority-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .case-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-assigned {
      background: #cce5ff;
      color: #004085;
    }

    .status-inreview {
      background: #d1ecf1;
      color: #0c5460;
    }

    .patient-info {
      font-size: 14px;
      color: var(--text-dark);
      margin-bottom: 5px;
    }

    .case-description {
      color: var(--text-dark);
      margin: 10px 0;
    }

    .case-meta {
      display: flex;
      gap: 15px;
      font-size: 13px;
      color: var(--text-light);
    }

    .case-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    .quick-actions, .summary-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-dark);
      background: var(--white);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: var(--background-color);
      border-color: var(--primary-color);
    }

    .action-icon {
      font-size: 20px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorDashboardComponent {
  isAvailable = true;

  stats = {
    queueCount: 5,
    inReview: 2,
    completedToday: 3,
    totalCompleted: 127,
    aiTriggered: 2
  };

  assignedCases = [
    {
      id: '1234',
      status: 'Assigned',
      priority: 'high',
      patientName: 'Jane Smith',
      age: 45,
      description: 'Suspicious mole on left arm, changing size',
      assignedDate: '2024-12-24',
      imageCount: 3
    },
    {
      id: '1235',
      status: 'Pending',
      priority: 'medium',
      patientName: 'Robert Johnson',
      age: 62,
      description: 'Recurring rash on back',
      assignedDate: '2024-12-24',
      imageCount: 2
    }
  ];

  toggleAvailability() {
    this.isAvailable = !this.isAvailable;
    console.log('Availability toggled:', this.isAvailable);
  }
}

