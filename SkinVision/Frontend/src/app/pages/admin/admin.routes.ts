import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./doctor-verification.component').then(m => m.DoctorVerificationComponent)
  },
  {
    path: 'logs',
    loadComponent: () => import('./system-logs.component').then(m => m.SystemLogsComponent)
  }
];
