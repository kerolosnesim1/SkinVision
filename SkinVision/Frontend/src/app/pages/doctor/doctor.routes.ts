import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'examination/new',
    loadComponent: () => import('./new-examination.component').then(m => m.NewExaminationComponent)
  },
  {
    path: 'examination/:id',
    loadComponent: () => import('./view-examination.component').then(m => m.ViewExaminationComponent)
  },
  {
    path: 'examinations',
    loadComponent: () => import('./examinations-list.component').then(m => m.ExaminationsListComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile.component').then(m => m.DoctorProfileComponent)
  }
];
