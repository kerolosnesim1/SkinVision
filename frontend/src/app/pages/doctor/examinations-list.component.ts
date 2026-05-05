import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
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
          <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
          <h1>Examination History</h1>
        </div>
        <a routerLink="/dashboard/examination/new" class="btn btn-primary">+ New Examination</a>
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
        <div *ngIf="errorMessage" class="empty-state">
          <p>{{ errorMessage }}</p>
        </div>

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
          <tbody *ngIf="!errorMessage">
            <tr *ngFor="let exam of filteredExaminations">
              <td class="date-cell">{{ exam.createdAt | date:'mediumDate' }}</td>
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
                <a [routerLink]="['/dashboard/examination', exam.diagnosisId]" class="btn btn-secondary btn-sm">View</a>
                <button class="btn btn-secondary btn-sm" (click)="downloadReport(exam)">PDF</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!errorMessage && filteredExaminations.length === 0" class="empty-state">
          <p>{{ (searchQuery || filterRisk || filterDate) ? 'No examinations match your filters.' : 'No examinations yet.' }}</p>
        </div>
      </div>

      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
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
  errorMessage = '';
  toastMessage = '';

  private filterSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private examinationService: ExaminationService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filterSubject
      .pipe(
        startWith(undefined),
        debounceTime(300),
        switchMap(() => {
          return this.examinationService.getExaminations(
            this.searchQuery || undefined,
            this.filterRisk || undefined,
            this.filterDate || undefined
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (list) => {
          this.filteredExaminations = list;
          this.errorMessage = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load examinations.';
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.filterSubject.complete();
  }

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
          this.showToast('Report downloaded');
        },
        error: (error) => {
          this.showToast('Failed to generate/download report');
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
