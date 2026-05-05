import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExaminationService } from '../../services/examination.service';
import { AuthService } from '../../services/auth.service';
import { ExaminationStats, ExaminationListItem } from '../../models/models';
import { forkJoin, Subject, takeUntil } from 'rxjs';

interface DonutSegment {
  color: string;
  label: string;
  count: number;
  dashArray: string;
  dashOffset: number;
}

interface SparkDay {
  label: string;
  fullDate: string;
  count: number;
  isToday: boolean;
  x: number;
  y: number;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="dashboard">

      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1>Welcome, Dr. {{ doctorName }}</h1>
          <p class="subtitle">{{ clinicName }}</p>
        </div>
        <a routerLink="/dashboard/examination/new" class="btn btn-primary btn-large">
          + New Examination
        </a>
      </div>

      <!-- KPI Cards -->
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

      <!-- Main content: list LEFT, charts RIGHT -->
      <div class="content-grid">

        <!-- Recent Examinations -->
        <div class="section">
          <div class="section-header">
            <h2>Recent Examinations</h2>
            <a routerLink="/dashboard/examinations" class="link">View All</a>
          </div>

          <div class="examinations-list">
            <div *ngIf="errorMessage" class="empty-state">
              <p>{{ errorMessage }}</p>
            </div>

            <ng-container *ngIf="!errorMessage">
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
                  <a [routerLink]="['/dashboard/examination', exam.diagnosisId]" class="btn btn-secondary btn-sm">
                    View
                  </a>
                </div>
              </div>

              <div *ngIf="recentExaminations.length === 0" class="empty-state">
                <p>No examinations yet</p>
                <a routerLink="/dashboard/examination/new" class="btn btn-primary">
                  Start Your First Examination
                </a>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Right column: charts stacked -->
        <div class="charts-col">

          <!-- Risk Distribution Donut -->
          <div class="chart-card">
            <div class="chart-title">Risk Distribution</div>

            <ng-container *ngIf="allExaminations.length > 0; else noRiskData">
              <div class="donut-wrap">
                <svg viewBox="0 0 120 120" class="donut-svg">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#f3f4f6" stroke-width="14"/>
                  <circle *ngFor="let seg of donutSegments"
                    cx="60" cy="60" r="45"
                    fill="none"
                    [attr.stroke]="seg.color"
                    stroke-width="14"
                    stroke-linecap="butt"
                    [attr.stroke-dasharray]="seg.dashArray"
                    [attr.stroke-dashoffset]="seg.dashOffset"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="56" text-anchor="middle" class="donut-center-num">{{ allExaminations.length }}</text>
                  <text x="60" y="70" text-anchor="middle" class="donut-center-label">Total</text>
                </svg>

                <div class="donut-legend">
                  <div *ngFor="let seg of donutSegments" class="legend-item">
                    <span class="legend-dot" [style.background]="seg.color"></span>
                    <span class="legend-text">{{ seg.label }}</span>
                    <span class="legend-count">{{ seg.count }}</span>
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-template #noRiskData>
              <div class="chart-empty">No data yet</div>
            </ng-template>
          </div>

          <!-- 7-Day Sparkline -->
          <div class="chart-card">
            <div class="chart-title-row">
              <span class="chart-title">Activity — Last 7 Days</span>
              <span class="chart-subtitle" *ngIf="maxDayCount > 0">peak: {{ maxDayCount }}</span>
            </div>

            <ng-container *ngIf="sparkDays.length > 0">
              <div class="spark-wrap">
                <svg [attr.viewBox]="sparkViewBox" class="spark-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#167D7E" stop-opacity="0.18"/>
                      <stop offset="100%" stop-color="#167D7E" stop-opacity="0"/>
                    </linearGradient>
                  </defs>

                  <!-- Horizontal grid lines -->
                  <line [attr.x1]="sparkPad" [attr.y1]="sparkPad" [attr.x2]="sparkW - sparkPad" [attr.y2]="sparkPad"
                    stroke="#f3f4f6" stroke-width="1"/>
                  <line [attr.x1]="sparkPad" [attr.y1]="sparkMidY" [attr.x2]="sparkW - sparkPad" [attr.y2]="sparkMidY"
                    stroke="#f3f4f6" stroke-width="1"/>
                  <line [attr.x1]="sparkPad" [attr.y1]="sparkBottom" [attr.x2]="sparkW - sparkPad" [attr.y2]="sparkBottom"
                    stroke="#f3f4f6" stroke-width="1"/>

                  <!-- Gradient area under curve -->
                  <path *ngIf="sparkAreaPath" [attr.d]="sparkAreaPath" fill="url(#sparkGrad)"/>

                  <!-- Smooth curve line -->
                  <path *ngIf="sparkLinePath" [attr.d]="sparkLinePath"
                    fill="none" stroke="#167D7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

                  <!-- Dot for today -->
                  <ng-container *ngFor="let day of sparkDays">
                    <circle *ngIf="day.isToday || day.count > 0"
                      [attr.cx]="day.x"
                      [attr.cy]="day.y"
                      [attr.r]="day.isToday ? 4 : 3"
                      [attr.fill]="day.isToday ? '#167D7E' : '#fff'"
                      [attr.stroke]="'#167D7E'"
                      stroke-width="2"
                    />
                  </ng-container>
                </svg>

                <!-- X-axis labels -->
                <div class="spark-labels">
                  <span *ngFor="let day of sparkDays"
                    class="spark-label"
                    [class.spark-label-today]="day.isToday"
                    [title]="day.fullDate"
                  >{{ day.label }}</span>
                </div>
              </div>
            </ng-container>
          </div>

        </div>
      </div>

      <div class="toast" *ngIf="toastMessage">{{ toastMessage }}</div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
    }

    /* ── Header ── */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .dashboard-header h1 {
      color: var(--primary-color);
      margin: 0 0 4px;
      font-size: 26px;
    }

    .subtitle {
      color: var(--text-light);
      margin: 0;
      font-size: 14px;
    }

    .btn-large {
      padding: 13px 26px;
      font-size: 15px;
      white-space: nowrap;
    }

    /* ── KPI Cards ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--white);
      border-radius: 14px;
      padding: 22px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      background: var(--background-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1;
    }

    .stat-content p {
      margin: 4px 0 0;
      color: var(--text-light);
      font-size: 13px;
    }

    /* ── Content grid: exams left, charts right ── */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 20px;
      align-items: start;
    }

    /* ── Recent Examinations ── */
    .section {
      background: var(--white);
      border-radius: 14px;
      padding: 22px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .link {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 13px;
    }

    .examinations-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .exam-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 18px;
      background: var(--background-color);
      border-radius: 10px;
      transition: box-shadow 0.2s;
    }

    .exam-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .exam-info h4 {
      margin: 0 0 3px;
      color: var(--text-dark);
      font-size: 14px;
    }

    .exam-info .reason {
      margin: 0 0 3px;
      color: var(--text-light);
      font-size: 13px;
    }

    .exam-info .date {
      margin: 0;
      color: var(--text-light);
      font-size: 12px;
    }

    .exam-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .risk-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .risk-badge.low    { background: #d4edda; color: #155724; }
    .risk-badge.medium { background: #fff3cd; color: #856404; }
    .risk-badge.high   { background: #f8d7da; color: #721c24; }

    .btn-sm {
      padding: 7px 14px;
      font-size: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    .empty-state p { margin-bottom: 16px; }

    /* ── Right column ── */
    .charts-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chart-card {
      background: var(--white);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .chart-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 18px;
    }

    .chart-title-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .chart-subtitle {
      font-size: 12px;
      color: var(--text-light);
    }

    .chart-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: var(--text-light);
      font-size: 13px;
    }

    /* ── Donut ── */
    .donut-wrap {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .donut-svg {
      width: 110px;
      height: 110px;
      flex-shrink: 0;
    }

    .donut-center-num {
      font-size: 20px;
      font-weight: 700;
      fill: var(--text-dark);
    }

    .donut-center-label {
      font-size: 9px;
      fill: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
    }

    .legend-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-text {
      flex: 1;
      color: var(--text-dark);
    }

    .legend-count {
      font-weight: 600;
      color: var(--text-dark);
      min-width: 18px;
      text-align: right;
    }

    /* ── Sparkline ── */
    .spark-wrap {
      display: flex;
      flex-direction: column;
    }

    .spark-svg {
      width: 100%;
      height: 90px;
      overflow: visible;
    }

    .spark-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      padding: 0 2px;
    }

    .spark-label {
      font-size: 10px;
      color: var(--text-light);
      text-align: center;
      flex: 1;
    }

    .spark-label-today {
      color: #167D7E;
      font-weight: 600;
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      padding: 12px 18px;
      border-radius: 8px;
      background: rgba(22, 125, 126, 0.95);
      color: white;
      z-index: 1000;
      font-size: 14px;
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .charts-col {
        flex-direction: row;
      }

      .chart-card {
        flex: 1;
      }
    }

    @media (max-width: 700px) {
      .charts-col {
        flex-direction: column;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit, OnDestroy {
  doctorName = '';
  clinicName = '';
  stats: ExaminationStats = { total: 0, today: 0, aiAnalyses: 0 };
  recentExaminations: ExaminationListItem[] = [];
  allExaminations: ExaminationListItem[] = [];
  errorMessage = '';
  toastMessage = '';

  donutSegments: DonutSegment[] = [];

  sparkDays: SparkDay[] = [];
  sparkLinePath = '';
  sparkAreaPath = '';
  maxDayCount = 0;

  // SVG viewport constants
  readonly sparkW = 260;
  readonly sparkH = 80;
  readonly sparkPad = 10;
  get sparkBottom(): number { return this.sparkH - this.sparkPad; }
  get sparkMidY(): number { return this.sparkPad + (this.sparkH - 2 * this.sparkPad) / 2; }
  get sparkViewBox(): string { return `0 0 ${this.sparkW} ${this.sparkH}`; }

  private readonly CIRCUMFERENCE = 2 * Math.PI * 45;
  private destroy$ = new Subject<void>();

  constructor(
    private examinationService: ExaminationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.refreshDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    this.doctorName = user?.doctorProfile?.fullName || 'Doctor';
    this.clinicName = user?.doctorProfile?.clinicName || 'Clinic';
  }

  private refreshDashboard(): void {
    forkJoin({
      stats: this.examinationService.getStats(),
      exams: this.examinationService.getExaminations()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ stats, exams }) => {
          this.stats = stats;
          this.allExaminations = exams;
          this.recentExaminations = exams.slice(0, 5);
          this.errorMessage = '';
          this.buildDonut();
          this.buildSparkline();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load dashboard data';
          this.cdr.detectChanges();
        }
      });
  }

  private buildDonut(): void {
    const counts = { low: 0, medium: 0, high: 0 };
    for (const exam of this.allExaminations) {
      const r = (exam.riskLevel ?? 'low').toLowerCase();
      if (r === 'high') counts.high++;
      else if (r === 'medium') counts.medium++;
      else counts.low++;
    }

    const total = this.allExaminations.length;
    const palette = [
      { key: 'low',    label: 'Low',    color: '#22c55e' },
      { key: 'medium', label: 'Medium', color: '#f59e0b' },
      { key: 'high',   label: 'High',   color: '#ef4444' },
    ] as const;

    let cumulative = 0;
    this.donutSegments = palette.map(({ key, label, color }) => {
      const count = counts[key];
      const fraction = total > 0 ? count / total : 0;
      const dash = fraction * this.CIRCUMFERENCE;
      const dashArray = `${dash} ${this.CIRCUMFERENCE - dash}`;
      const dashOffset = this.CIRCUMFERENCE - cumulative;
      cumulative += dash;
      return { color, label, count, dashArray, dashOffset };
    });
  }

  private buildSparkline(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count exams per day
    const countByDay = new Map<string, number>();
    for (const exam of this.allExaminations) {
      if (!exam.createdAt) continue;
      const d = new Date(exam.createdAt);
      d.setHours(0, 0, 0, 0);
      countByDay.set(d.toISOString().slice(0, 10), (countByDay.get(d.toISOString().slice(0, 10)) ?? 0) + 1);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const raw: Array<{ label: string; fullDate: string; count: number; isToday: boolean }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      raw.push({
        label: i === 0 ? 'Today' : dayNames[d.getDay()],
        fullDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count: countByDay.get(key) ?? 0,
        isToday: i === 0,
      });
    }

    this.maxDayCount = Math.max(...raw.map(d => d.count), 1);

    const W = this.sparkW;
    const H = this.sparkH;
    const pad = this.sparkPad;
    const plotW = W - 2 * pad;
    const plotH = H - 2 * pad;
    const n = raw.length;

    // Compute SVG coordinates
    const pts = raw.map((d, i) => ({
      x: pad + (i / (n - 1)) * plotW,
      y: pad + plotH - (d.count / this.maxDayCount) * plotH,
    }));

    this.sparkDays = raw.map((d, i) => ({
      ...d,
      x: pts[i].x,
      y: pts[i].y,
    }));

    // Build smooth cubic bezier path (catmull-rom → bezier)
    this.sparkLinePath = this.smoothCurvePath(pts);

    // Area: same curve + close to bottom
    const bottom = pad + plotH;
    this.sparkAreaPath =
      this.sparkLinePath +
      ` L ${pts[n - 1].x},${bottom} L ${pts[0].x},${bottom} Z`;
  }

  /** Catmull-Rom spline converted to cubic bezier segments */
  private smoothCurvePath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    const n = pts.length;
    let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;

    for (let i = 0; i < n - 1; i++) {
      const prev = pts[Math.max(0, i - 1)];
      const curr = pts[i];
      const next = pts[i + 1];
      const next2 = pts[Math.min(n - 1, i + 2)];

      const cp1x = curr.x + (next.x - prev.x) / 6;
      const cp1y = curr.y + (next.y - prev.y) / 6;
      const cp2x = next.x - (next2.x - curr.x) / 6;
      const cp2y = next.y - (next2.y - curr.y) / 6;

      d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
    }

    return d;
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => { this.toastMessage = ''; }, 3000);
  }
}
