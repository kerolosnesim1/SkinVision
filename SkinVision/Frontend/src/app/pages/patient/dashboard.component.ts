import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Patient Dashboard</h1>
        <a routerLink="/patient/create-case" class="btn btn-primary">+ New Case</a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-color);">📋</div>
          <div class="stat-content">
            <h3>{{ stats.totalCases }}</h3>
            <p>Total Cases</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning);">⏳</div>
          <div class="stat-content">
            <h3>{{ stats.pendingCases }}</h3>
            <p>Pending Review</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--success);">✓</div>
          <div class="stat-content">
            <h3>{{ stats.completedCases }}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info);">💬</div>
          <div class="stat-content">
            <h3>{{ stats.unreadMessages }}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <div class="section-header">
            <h2>Recent Cases</h2>
            <a routerLink="/patient/cases" class="link">View All</a>
          </div>

          <div class="cases-list">
            <div *ngFor="let case of recentCases" class="case-card">
              <div class="case-header">
                <span class="case-id">Case #{{ case.id }}</span>
                <span class="case-status" [class]="'status-' + case.status.toLowerCase()">
                  {{ case.status }}
                </span>
              </div>
              <div class="case-body">
                <p class="case-date">{{ case.date }}</p>
                <p class="case-description">{{ case.description }}</p>
                <p class="case-doctor" *ngIf="case.doctor">
                  <strong>Doctor:</strong> {{ case.doctor }}
                </p>
              </div>
              <div class="case-footer">
                <a [routerLink]="['/patient/case', case.id]" class="btn btn-secondary btn-sm">
                  View Details
                </a>
              </div>
            </div>

            <div *ngIf="recentCases.length === 0" class="empty-state">
              <p>No cases yet</p>
              <a routerLink="/patient/create-case" class="btn btn-primary">Create Your First Case</a>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="quick-actions">
            <button class="action-btn" (click)="navigateTo('/patient/create-case')">
              <span class="action-icon">➕</span>
              <span class="action-text">Create New Case</span>
            </button>
            <button class="action-btn" (click)="navigateTo('/patient/profile')">
              <span class="action-icon">👤</span>
              <span class="action-text">Update Profile</span>
            </button>
            <button class="action-btn" (click)="navigateTo('/patient/cases')">
              <span class="action-icon">📂</span>
              <span class="action-text">My Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
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

    .link:hover {
      color: var(--secondary-color);
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
      transition: all 0.3s ease;
    }

    .case-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

    .status-assigned, .status-inreview {
      background: #cce5ff;
      color: #004085;
    }

    .status-completed {
      background: #d4edda;
      color: #155724;
    }

    .case-body {
      margin-bottom: 10px;
    }

    .case-date {
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .case-description {
      color: var(--text-dark);
      margin-bottom: 5px;
    }

    .case-doctor {
      font-size: 14px;
      color: var(--text-light);
    }

    .case-footer {
      display: flex;
      justify-content: flex-end;
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

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--white);
      color: var(--text-dark);
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      text-align: left;
      font-size: 15px;
    }

    .action-btn:hover {
      background: var(--background-color);
      border-color: var(--primary-color);
      transform: translateX(5px);
    }

    .action-icon {
      font-size: 24px;
    }

    .action-text {
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  stats = {
    totalCases: 5,
    pendingCases: 2,
    completedCases: 3,
    unreadMessages: 1
  };

  recentCases = [
    {
      id: '1234',
      status: 'Pending',
      date: '2024-12-20',
      description: 'Suspicious mole on left arm',
      doctor: null
    },
    {
      id: '1233',
      status: 'InReview',
      date: '2024-12-18',
      description: 'Rash on back',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: '1232',
      status: 'Completed',
      date: '2024-12-15',
      description: 'Skin discoloration',
      doctor: 'Dr. Michael Chen'
    }
  ];
}

