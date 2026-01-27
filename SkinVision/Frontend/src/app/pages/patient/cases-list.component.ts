import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="cases-container">
      <div class="page-header">
        <h1>My Cases</h1>
        <a routerLink="/patient/create-case" class="btn btn-primary">+ New Case</a>
      </div>

      <!-- Search and Filters -->
      <div class="card filters-section">
        <div class="filters-row">
          <div class="search-box">
            <input type="text" 
                   [(ngModel)]="searchTerm" 
                   (ngModelChange)="applyFilters()"
                   placeholder="Search by case ID or description...">
          </div>

          <div class="filter-group">
            <label>Status:</label>
            <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="InReview">In Review</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Sort by:</label>
            <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status">Status</option>
            </select>
          </div>

          <button class="btn btn-secondary" (click)="clearFilters()">Clear Filters</button>
        </div>

        <div class="results-info">
          Showing {{ filteredCases.length }} of {{ allCases.length }} cases
        </div>
      </div>

      <!-- Cases List -->
      <div class="cases-grid">
        <div *ngFor="let case of filteredCases" class="case-card">
          <div class="case-header">
            <div>
              <span class="case-id">Case #{{ case.id }}</span>
              <span class="case-date">{{ case.submittedDate }}</span>
            </div>
            <span class="case-status" [class]="'status-' + case.status.toLowerCase()">
              {{ case.status }}
            </span>
          </div>

          <div class="case-body">
            <h3>{{ case.title }}</h3>
            <p class="case-description">{{ case.description }}</p>

            <div class="case-meta">
              <span>📍 {{ case.affectedArea }}</span>
              <span>📷 {{ case.imageCount }} images</span>
              <span *ngIf="case.doctor">👨‍⚕️ {{ case.doctor }}</span>
            </div>

            <div *ngIf="case.unreadMessages > 0" class="unread-badge">
              {{ case.unreadMessages }} new message(s)
            </div>
          </div>

          <div class="case-footer">
            <a [routerLink]="['/patient/case', case.id]" class="btn btn-primary btn-sm">
              View Details
            </a>
            <span class="last-updated">Updated {{ case.lastUpdated }}</span>
          </div>
        </div>

        <div *ngIf="filteredCases.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No cases found</h3>
          <p *ngIf="searchTerm || statusFilter">Try adjusting your filters</p>
          <p *ngIf="!searchTerm && !statusFilter">You haven't created any cases yet</p>
          <a routerLink="/patient/create-case" class="btn btn-primary">Create Your First Case</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cases-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 0;
    }

    .filters-section {
      margin-bottom: 30px;
      padding: 20px;
    }

    .filters-row {
      display: flex;
      gap: 15px;
      align-items: flex-end;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
    }

    .search-box input {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .filter-group select {
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--white);
    }

    .results-info {
      font-size: 14px;
      color: var(--text-light);
    }

    .cases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .case-card {
      background: var(--white);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .case-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .case-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }

    .case-id {
      font-weight: 600;
      color: var(--primary-color);
      display: block;
    }

    .case-date {
      font-size: 12px;
      color: var(--text-light);
    }

    .case-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-pending { background: #fff3cd; color: #856404; }
    .status-assigned { background: #cce5ff; color: #004085; }
    .status-inreview { background: #d1ecf1; color: #0c5460; }
    .status-completed { background: #d4edda; color: #155724; }
    .status-closed { background: #e2e3e5; color: #383d41; }

    .case-body {
      flex: 1;
      margin-bottom: 15px;
    }

    .case-body h3 {
      margin: 0 0 10px 0;
      color: var(--text-dark);
      font-size: 18px;
    }

    .case-description {
      color: var(--text-dark);
      line-height: 1.6;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .case-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 13px;
      color: var(--text-light);
    }

    .unread-badge {
      display: inline-block;
      margin-top: 10px;
      padding: 6px 12px;
      background: var(--error);
      color: var(--white);
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .case-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid var(--border-color);
    }

    .last-updated {
      font-size: 12px;
      color: var(--text-light);
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: var(--white);
      border-radius: 8px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: var(--text-dark);
      margin-bottom: 10px;
    }

    .empty-state p {
      color: var(--text-light);
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        width: 100%;
      }

      .cases-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CasesListComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  sortBy = 'date-desc';

  allCases = [
    {
      id: '1234',
      title: 'Suspicious mole on left arm',
      description: 'I noticed a dark mole on my left arm that has been growing slowly over the past few weeks. It has irregular borders.',
      status: 'InReview',
      submittedDate: '2024-12-20',
      lastUpdated: '2 hours ago',
      affectedArea: 'Left Arm',
      imageCount: 3,
      doctor: 'Dr. Sarah Johnson',
      unreadMessages: 2
    },
    {
      id: '1233',
      title: 'Recurring rash on back',
      description: 'Red, itchy rash that keeps coming back every few weeks. Tried over-the-counter creams with no improvement.',
      status: 'Assigned',
      submittedDate: '2024-12-18',
      lastUpdated: '1 day ago',
      affectedArea: 'Back',
      imageCount: 2,
      doctor: 'Dr. Michael Chen',
      unreadMessages: 0
    },
    {
      id: '1232',
      title: 'Skin discoloration on face',
      description: 'Dark patches appearing on my cheeks. They seem to get worse with sun exposure.',
      status: 'Completed',
      submittedDate: '2024-12-15',
      lastUpdated: '3 days ago',
      affectedArea: 'Face',
      imageCount: 4,
      doctor: 'Dr. Sarah Johnson',
      unreadMessages: 0
    },
    {
      id: '1231',
      title: 'Acne breakout',
      description: 'Sudden severe acne on forehead and chin. Started about a month ago.',
      status: 'Closed',
      submittedDate: '2024-12-10',
      lastUpdated: '1 week ago',
      affectedArea: 'Face',
      imageCount: 2,
      doctor: 'Dr. Emily Roberts',
      unreadMessages: 0
    },
    {
      id: '1230',
      title: 'Dry, cracked skin on hands',
      description: 'Extremely dry skin on hands with cracking and bleeding. Worsens in cold weather.',
      status: 'Pending',
      submittedDate: '2024-12-24',
      lastUpdated: '1 hour ago',
      affectedArea: 'Hands',
      imageCount: 3,
      doctor: null,
      unreadMessages: 0
    }
  ];

  filteredCases = [...this.allCases];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCases = this.allCases.filter(c => {
      const matchesSearch = !this.searchTerm || 
        c.id.includes(this.searchTerm) ||
        c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || c.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    this.filteredCases.sort((a, b) => {
      if (this.sortBy === 'date-desc') {
        return b.submittedDate.localeCompare(a.submittedDate);
      } else if (this.sortBy === 'date-asc') {
        return a.submittedDate.localeCompare(b.submittedDate);
      } else if (this.sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.sortBy = 'date-desc';
    this.applyFilters();
  }
}

