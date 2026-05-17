import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppRole } from '../models/team-pulse.models';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  // Learning Lab: Dependency injection in functions
  // Functional guards use inject() because they do not have a constructor.
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as AppRole[] | undefined;

  if (!roles?.length || auth.hasRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
