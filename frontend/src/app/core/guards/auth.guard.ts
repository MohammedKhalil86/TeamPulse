import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Learning Lab: Route guards
  // Returning a UrlTree redirects without manually navigating inside the guard.
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
