import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'case/:id',
    loadComponent: () => import('./case-review.component').then(m => m.CaseReviewComponent)
  },
  {
    path: 'cases',
    loadComponent: () => import('./cases-list.component').then(m => m.DoctorCasesListComponent)
  }
];
