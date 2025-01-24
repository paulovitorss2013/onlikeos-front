import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  // MÉTODO PARA VERIFICAR SE O USUÁRIO PODE ACESSAR A ROTA
  static canActivate() {
    const authService = inject(AuthService);
    const router = inject(Router);

    const authenticated = authService.isAuthenticate();
    if (authenticated) {
      return true;
    } else {
      router.navigate(['login']); // REDIRECIONA PARA LOGIN CASO NÃO AUTENTICADO
      return false;
    }
  }
}
