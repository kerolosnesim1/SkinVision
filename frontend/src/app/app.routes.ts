import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    canMatch: [noAuthGuard],
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canMatch: [noAuthGuard],
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'doctor',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/static/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/static/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/static/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/static/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadChildren: () => import('./pages/doctor/doctor.routes').then(m => m.DOCTOR_ROUTES)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./pages/auth/oauth-callback.component').then(m => m.OAuthCallbackComponent)
  },
  { path: '**', redirectTo: '' }
];
