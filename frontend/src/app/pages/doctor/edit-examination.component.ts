import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExaminationService } from '../../services/examination.service';
import { Examination, UpdateExamination } from '../../models/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-edit-examination',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule],
    template: `
    <div class="edit-page">
      <div class="page-header">
        <a [routerLink]="['/dashboard/examination', examId]" class="back-link">← Back to Examination</a>
        <h1>Edit Examination #{{ examId }}</h1>
      </div>

      <div class="error-state" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
        <a [routerLink]="['/dashboard/examination', examId]" class="btn btn-primary">Back to Examination</a>
      </div>

      <div class="card" *ngIf="exam && !errorMessage">
        <form #editForm="ngForm" (ngSubmit)="save()">
          <div class="form-section">
            <h2>Diagnosis & Treatment</h2>

            <div class="form-group">
              <label for="diagnosis">Diagnosis</label>
              <textarea id="diagnosis" [(ngModel)]="form.diagnosis" name="diagnosis" rows="3"
                        placeholder="Enter diagnosis"></textarea>
            </div>

            <div class="form-group">
              <label for="treatment">Treatment Plan</label>
              <textarea id="treatment" [(ngModel)]="form.treatment" name="treatment" rows="3"
                        placeholder="Enter treatment plan"></textarea>
            </div>

            <div class="form-group">
              <label for="followUp">Follow-up Instructions</label>
              <textarea id="followUp" [(ngModel)]="form.followUp" name="followUp" rows="3"
                        placeholder="Enter follow-up instructions"></textarea>
            </div>
          </div>

          <div class="form-section">
            <h2>Risk & Follow-up Date</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="riskLevel">Risk Level</label>
                <select id="riskLevel" [(ngModel)]="form.riskLevel" name="riskLevel">
                  <option value="">Not Set</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div class="form-group">
                <label for="followUpDate">Follow-up Date</label>
                <input type="date" id="followUpDate" [(ngModel)]="form.followUpDate" name="followUpDate">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
            <a [routerLink]="['/dashboard/examination', examId]" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>

      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
    styles: [`
    .edit-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
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

    .page-header h1 {
      color: var(--primary-color);
      margin: 8px 0 0 0;
    }

    .card {
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 30px;
    }

    .form-section {
      margin-bottom: 30px;
    }

    .form-section h2 {
      font-size: 16px;
      color: var(--primary-color);
      margin: 0 0 20px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      color: var(--text-light);
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      border: none;
      cursor: pointer;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: var(--secondary-color);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      cursor: pointer;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .error-state {
      text-align: center;
      padding: 80px 20px;
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
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class EditExaminationComponent implements OnInit, OnDestroy {
    examId: string = '';
    exam: Examination | null = null;
    errorMessage = '';
    toastMessage = '';
    saving = false;

    form = {
        diagnosis: '',
        treatment: '',
        followUp: '',
        riskLevel: '',
        followUpDate: '',
    };

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private examinationService: ExaminationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.examId = this.route.snapshot.params['id'];
        this.loadExamination();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadExamination(): void {
        this.examinationService.getExamination(+this.examId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (exam) => {
                    this.exam = exam;
                    this.form = {
                        diagnosis: exam.diagnosis || '',
                        treatment: exam.treatment || '',
                        followUp: exam.followUp || '',
                        riskLevel: exam.riskLevel || '',
                        followUpDate: exam.followUpDate ? this.formatDate(exam.followUpDate) : '',
                    };
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.errorMessage = 'Failed to load examination.';
                    this.cdr.detectChanges();
                }
            });
    }

    save(): void {
        if (this.saving) return;
        this.saving = true;

        const payload: UpdateExamination = {
            diagnosis: this.form.diagnosis || undefined,
            treatment: this.form.treatment || undefined,
            followUp: this.form.followUp || undefined,
            riskLevel: this.form.riskLevel || undefined,
            followUpDate: this.form.followUpDate ? new Date(this.form.followUpDate) : undefined,
        };

        this.examinationService.updateExamination(+this.examId, payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.showToast('Examination updated successfully');
                    this.router.navigate(['/dashboard/examination', this.examId]);
                },
                error: () => {
                    this.saving = false;
                    this.showToast('Failed to update examination');
                    this.cdr.detectChanges();
                }
            });
    }

    private formatDate(date: Date | string): string {
        const d = date instanceof Date ? date : new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    }
}
