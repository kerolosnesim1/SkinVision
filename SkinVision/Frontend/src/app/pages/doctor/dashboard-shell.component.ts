import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="shell" [class.collapsed]="isCollapsed$ | async" [class.mobile-open]="isMobileOpen$ | async">

      <!-- Mobile backdrop -->
      <div class="backdrop" (click)="sidebar.closeMobile()"></div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
              <circle cx="16" cy="16" r="8" fill="currentColor" opacity="0.3"/>
              <circle cx="16" cy="16" r="4" fill="currentColor"/>
            </svg>
            <span class="logo-text">SkinVision</span>
          </a>
          <button class="collapse-btn" (click)="sidebar.toggle()" [attr.aria-label]="(isCollapsed$ | async) ? 'Expand sidebar' : 'Collapse sidebar'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" title="Dashboard" (click)="onNavPointerClick($event)">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span class="nav-label">Dashboard</span>
          </a>
          <a routerLink="/dashboard/examinations" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" title="Examinations" (click)="onNavPointerClick($event)">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
            <span class="nav-label">Examinations</span>
          </a>
          <a routerLink="/dashboard/examination/new" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link nav-link-accent" title="New Examination" (click)="onNavPointerClick($event)">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
            </svg>
            <span class="nav-label">New Examination</span>
          </a>
          <a routerLink="/dashboard/profile" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" title="Profile" (click)="onNavPointerClick($event)">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span class="nav-label">Profile</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card" *ngIf="currentUser$ | async as user">
            <div class="user-avatar">{{ getInitial(user) }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.doctorProfile?.fullName || user.username || 'Doctor' }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Logout">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span class="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main area -->
      <div class="main-area">
        <!-- Mobile top bar -->
        <div class="mobile-topbar">
          <button class="mobile-menu-btn" (click)="sidebar.toggleMobile()" aria-label="Open menu">
            <span class="hamburger"></span>
          </button>
          <span class="mobile-brand">SkinVision</span>
        </div>

        <div class="page-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
    }

    .shell {
      display: flex;
      width: 100%;
      min-height: 100vh;
      background: #F0F8F9;
    }

    /* ─── Backdrop (mobile) ─── */
    .backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 199;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .shell.mobile-open .backdrop {
      display: block;
      opacity: 1;
    }

    /* ─── Sidebar ─── */
    .sidebar {
      width: 260px;
      min-height: 100vh;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 200;
      transition: width 0.28s ease, transform 0.28s ease;
      overflow: hidden;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    }

    .shell.collapsed .sidebar {
      width: 72px;
    }

    /* ─── Sidebar Header ─── */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px 20px 20px;
      border-bottom: 1px solid #f3f4f6;
      min-height: 72px;
      gap: 8px;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #167D7E;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
    }

    .sidebar-logo svg {
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      opacity: 1;
      transition: opacity 0.2s ease;
      overflow: hidden;
    }

    .shell.collapsed .logo-text {
      opacity: 0;
      width: 0;
    }

    .collapse-btn {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f9fafb;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .collapse-btn:hover {
      background: #f0f8f9;
      color: #167D7E;
      border-color: #167D7E;
    }

    .collapse-btn svg {
      transition: transform 0.28s ease;
    }

    .shell.collapsed .collapse-btn svg {
      transform: rotate(180deg);
    }

    /* ─── Nav ─── */
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: 10px;
      color: #4b5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease;
      position: relative;
    }

    /* Real hover only (avoids sticky :hover on touch / after tap) */
    @media (hover: hover) and (pointer: fine) {
      .nav-link:hover:not(.active) {
        background: #f0f8f9;
        color: #167D7E;
      }
    }

    .nav-link.active {
      background: rgba(22, 125, 126, 0.1);
      color: #167D7E;
      font-weight: 600;
    }

    .nav-link.active:hover {
      background: rgba(22, 125, 126, 0.1);
      color: #167D7E;
    }

    /* Idle state matches other links; accent only on hover/active */
    .nav-link-accent {
      background: transparent;
      color: #167D7E;
      font-weight: 600;
    }

    @media (hover: hover) and (pointer: fine) {
      .nav-link-accent:hover:not(.active) {
        background: linear-gradient(135deg, rgba(22, 125, 126, 0.12), rgba(43, 177, 184, 0.12));
      }
    }

    .nav-link-accent.active {
      background: linear-gradient(135deg, rgba(22, 125, 126, 0.18), rgba(43, 177, 184, 0.18));
    }

    .nav-link-accent.active:hover {
      background: linear-gradient(135deg, rgba(22, 125, 126, 0.18), rgba(43, 177, 184, 0.18));
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-label {
      opacity: 1;
      transition: opacity 0.15s ease;
      overflow: hidden;
    }

    .shell.collapsed .nav-label {
      opacity: 0;
      width: 0;
    }

    /* Collapsed tooltip on hover */
    .shell.collapsed .nav-link {
      justify-content: center;
      padding: 11px;
    }

    /* ─── Sidebar Footer ─── */
    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid #f3f4f6;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #f9fafb;
      overflow: hidden;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 15px;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 1;
      transition: opacity 0.15s ease;
    }

    .shell.collapsed .user-info {
      opacity: 0;
      width: 0;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 11px;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 11px 12px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease;
    }

    .logout-btn:hover {
      background: #fef2f2;
      color: #ef4444;
    }

    .shell.collapsed .logout-btn {
      justify-content: center;
      padding: 11px;
    }

    /* ─── Main area ─── */
    .main-area {
      flex: 1;
      margin-left: 260px;
      transition: margin-left 0.28s ease;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .shell.collapsed .main-area {
      margin-left: 72px;
    }

    /* ─── Mobile top bar ─── */
    .mobile-topbar {
      display: none;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .mobile-menu-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .mobile-menu-btn:hover {
      background: #f0f8f9;
    }

    .hamburger,
    .hamburger::before,
    .hamburger::after {
      display: block;
      width: 22px;
      height: 2px;
      background: #167D7E;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .hamburger {
      position: relative;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
    }

    .hamburger::before { top: -7px; }
    .hamburger::after  { top:  7px; }

    .mobile-brand {
      font-size: 18px;
      font-weight: 700;
      color: #167D7E;
    }

    .page-content {
      flex: 1;
    }

    /* ─── Responsive ─── */
    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
        width: 260px !important;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
      }

      .shell.mobile-open .sidebar {
        transform: translateX(0);
      }

      .main-area {
        margin-left: 0 !important;
      }

      .mobile-topbar {
        display: flex;
      }

      .collapse-btn {
        display: none;
      }
    }
  `]
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isCollapsed$: Observable<boolean>;
  isMobileOpen$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(
    public sidebar: SidebarService,
    private auth: AuthService,
    private router: Router
  ) {
    this.isCollapsed$ = this.sidebar.isCollapsed$;
    this.isMobileOpen$ = this.sidebar.isMobileOpen$;
    this.currentUser$ = this.auth.currentUser$;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => this.sidebar.closeMobile());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitial(user: User): string {
    return (user.doctorProfile?.fullName || user.username || user.email || 'D')
      .trim().charAt(0).toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  /** Drop focus after real mouse clicks so the previous link does not stay “stuck” highlighted. */
  onNavPointerClick(ev: MouseEvent): void {
    if (ev.detail === 0) return;
    (ev.currentTarget as HTMLElement)?.blur();
  }
}
