import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.PatientDashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile.component').then(m => m.PatientProfileComponent)
  },
  {
    path: 'create-case',
    loadComponent: () => import('./create-case.component').then(m => m.CreateCaseComponent)
  },
  {
    path: 'cases',
    loadComponent: () => import('./cases-list.component').then(m => m.CasesListComponent)
  },
  {
    path: 'case/:id',
    loadComponent: () => import('./case-detail.component').then(m => m.CaseDetailComponent)
  }
];
