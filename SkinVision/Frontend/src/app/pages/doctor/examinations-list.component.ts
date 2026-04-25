import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ExaminationService } from '../../services/examination.service';
import { ExaminationListItem } from '../../models/models';
import { ReportService } from '../../services/report.service';
@Component({
  selector: 'app-examinations-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="examinations-page">
      <div class="page-header">
        <div>
          <a routerLink="/doctor" class="back-link">← Back to Dashboard</a>
          <h1>Examination History</h1>
        </div>
        <a routerLink="/doctor/examination/new" class="btn btn-primary">+ New Examination</a>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by patient name..." 
                 (input)="applyFilters()">
        </div>
        <div class="filter-group">
          <select [(ngModel)]="filterRisk" (change)="applyFilters()">
            <option value="">All Risk Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div class="filter-group">
          <input type="date" [(ngModel)]="filterDate" (change)="applyFilters()">
        </div>
      </div>

      <!-- Examinations Table -->
      <div class="card">
        <table class="exam-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Reason</th>
              <th>Diagnosis</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let exam of filteredExaminations">
              <td class="date-cell">{{ exam.createdAt }}</td>
              <td>
                <strong>{{ exam.patientName }}</strong>
                <span class="phone">{{ exam.patientPhone }}</span>
              </td>
              <td>{{ exam.reason }}</td>
              <td class="diagnosis-cell">{{ exam.diagnosis }}</td>
              <td>
                <span class="risk-badge" [class]="exam.riskLevel?.toLowerCase()">
                  {{ exam.riskLevel }}
                </span>
              </td>
              <td class="actions-cell">
                <a [routerLink]="['/doctor/examination', exam.diagnosisId]" class="btn btn-secondary btn-sm">View</a>
                <button class="btn btn-secondary btn-sm" (click)="downloadReport(exam)">PDF</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredExaminations.length === 0" class="empty-state">
          <p>No examinations found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .examinations-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
    }

    .back-link {
      color: var(--text-light);
      text-decoration: none;
      font-size: 14px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 8px 0 0 0;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .search-box {
      flex: 1;
    }

    .search-box input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
    }

    .filter-group select,
    .filter-group input {
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
    }

    .exam-table {
      width: 100%;
      border-collapse: collapse;
    }

    .exam-table th,
    .exam-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .exam-table th {
      font-weight: 600;
      color: var(--text-light);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .exam-table tr:hover {
      background: var(--background-color);
    }

    .date-cell {
      white-space: nowrap;
      color: var(--text-light);
      font-size: 14px;
    }

    .phone {
      display: block;
      font-size: 13px;
      color: var(--text-light);
    }

    .diagnosis-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .risk-badge {
      padding: 4px 12px;
      border-radius: 12px;
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

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 50px;
      color: var(--text-light);
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .exam-table {
        font-size: 14px;
      }

      .exam-table th,
      .exam-table td {
        padding: 10px;
      }
    }
  `]
})
export class ExaminationsListComponent implements OnInit, OnDestroy {
  searchQuery = '';
  filterRisk = '';
  filterDate = '';
  filteredExaminations: ExaminationListItem[] = [];

  /** Subject that emits every time a filter changes; debounced to avoid API spam */
  private filterSubject = new Subject<void>();

  constructor(
    private examinationService: ExaminationService,
    private reportService: ReportService
  ) { }

  /**
   * On init: load the initial list AND set up the debounced filter pipeline.
   * debounceTime(300)  – waits 300 ms of silence before firing the API call.
   * distinctUntilChanged() – skips duplicate consecutive emissions (optional but nice).
   */
  ngOnInit(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadExaminations());

    this.loadExaminations();
  }

  /** Clean up the Subject to avoid memory leaks */
  ngOnDestroy(): void {
    this.filterSubject.complete();
  }

  /* The server handles all filtering */
  loadExaminations(): void {
    this.examinationService
      .getExaminations(this.searchQuery, this.filterRisk, this.filterDate)
      .subscribe({
        next: (list) => {
          this.filteredExaminations = list;
        },
        error: (error) => {
          console.error('Failed to load examinations:', error);
        }
      });
  }

  /**
   * Pushes a value onto the filter Subject instead of calling the API directly.
   * The Subject's debounce pipeline will fire loadExaminations() after 300 ms of inactivity.
   */
  applyFilters(): void {
    this.filterSubject.next();
  }

  /**
   * Generates a report for the examination, then immediately downloads the PDF.
   *
   * switchMap: pipes the generateReport result into downloadReport automatically,
   * flattening the nested Observable into a single subscription chain.
   * If generateReport emits a new value before downloadReport finishes,
   * switchMap cancels the previous inner Observable (prevents race conditions).
   */
  downloadReport(exam: ExaminationListItem): void {
    this.reportService.generateReport(exam.diagnosisId)
      .pipe(switchMap(report => this.reportService.downloadReport(report.reportId)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report-${exam.diagnosisId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Failed to download report:', error);
        }
      });
  }
}
