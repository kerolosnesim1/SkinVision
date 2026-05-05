import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';

export const authGuard: CanMatchFn = () => {
  const router = inject(Router);
  const hasToken = !!localStorage.getItem('token');

  if (hasToken) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
