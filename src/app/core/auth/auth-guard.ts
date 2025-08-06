import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1), // Toma el primer valor emitido y se desuscribe
    map(user => {
      if (user) {
        return true; // Si hay usuario, permite el acceso
      } else {
        router.navigate(['/login']); // Si no, redirige a login
        return false;
      }
    })
  );
};