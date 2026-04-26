import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';

export const noAuthGuard: CanMatchFn = () => {
  const router = inject(Router);
  const hasToken = !!localStorage.getItem('token');

  if (hasToken) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
