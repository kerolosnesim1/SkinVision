import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-color);">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--info);">🩺</div>
          <div class="stat-content">
            <h3>{{ stats.activeDoctors }}</h3>
            <p>Active Doctors</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--secondary-color);">🧑</div>
          <div class="stat-content">
            <h3>{{ stats.totalPatients }}</h3>
            <p>Patients</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning);">⏳</div>
          <div class="stat-content">
            <h3>{{ stats.pendingVerifications }}</h3>
            <p>Pending Verifications</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <div class="section-header">
            <h2>Recent Activity</h2>
          </div>

          <div class="activity-list">
            <div *ngFor="let activity of recentActivity" class="activity-item">
              <div class="activity-icon" [style.background]="activity.color">
                {{ activity.icon }}
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="section">
            <h3>Quick Actions</h3>
            <div class="quick-actions">
              <a routerLink="/admin/doctors" class="action-btn">
                <span class="action-icon">✅</span>
                <span>Verify Doctors</span>
                <span class="badge">{{ stats.pendingVerifications }}</span>
              </a>
              <a routerLink="/admin/logs" class="action-btn">
                <span class="action-icon">📋</span>
                <span>System Logs</span>
              </a>
            </div>
          </div>

          <div class="section">
            <h3>System Stats</h3>
            <div class="summary-list">
              <div class="summary-item">
                <span>Total Cases</span>
                <strong>{{ stats.totalCases }}</strong>
              </div>
              <div class="summary-item">
                <span>Cases Today</span>
                <strong>{{ stats.casesToday }}</strong>
              </div>
              <div class="summary-item">
                <span>Avg Response Time</span>
                <strong>{{ stats.avgResponseTime }}</strong>
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
      margin-bottom: 20px;
    }

    .section h2, .section h3 {
      margin: 0 0 20px 0;
      color: var(--text-dark);
    }

    .section h2 {
      font-size: 20px;
    }

    .section h3 {
      font-size: 16px;
    }

    .section-header {
      margin-bottom: 20px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .activity-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: var(--background-color);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 4px 0;
      color: var(--text-dark);
      font-size: 14px;
    }

    .activity-time {
      margin: 0;
      font-size: 12px;
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
      transition: all 0.3s ease;
      position: relative;
    }

    .action-btn:hover {
      background: var(--background-color);
      border-color: var(--primary-color);
    }

    .action-icon {
      font-size: 20px;
    }

    .badge {
      margin-left: auto;
      background: var(--error);
      color: var(--white);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
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
export class AdminDashboardComponent {
  stats = {
    totalUsers: 245,
    activeDoctors: 12,
    totalPatients: 233,
    pendingVerifications: 3,
    totalCases: 450,
    casesToday: 15,
    avgResponseTime: '2h 15m'
  };

  recentActivity = [
    {
      icon: '👤',
      color: 'var(--info)',
      text: 'New doctor registration: Dr. Sarah Johnson',
      time: '5 minutes ago'
    },
    {
      icon: '📋',
      color: 'var(--success)',
      text: 'Case #1245 completed by Dr. Chen',
      time: '15 minutes ago'
    },
    {
      icon: '✅',
      color: 'var(--primary-color)',
      text: 'Doctor verified: Dr. Michael Williams',
      time: '1 hour ago'
    },
    {
      icon: '💳',
      color: 'var(--warning)',
      text: 'Payment processed for Case #1244',
      time: '2 hours ago'
    }
  ];
}

