import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CanMatchFn } from '@angular/router';

/**
 * VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO E PODE ACESSAR A ROTA.
 * SE NÃO ESTIVER AUTENTICADO, REDIRECIONA PARA A PÁGINA DE LOGIN.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  return verificarAcesso();
};

/**
 * VERIFICA SE O USUÁRIO PODE CARREGAR MÓDULOS DE FORMA ASSÍNCRONA.
 */
export const authLoadGuard: CanMatchFn = (route, segments) => {
  return verificarAcesso();
};

/**
 * MÉTODO QUE VERIFICA A AUTENTICAÇÃO E REDIRECIONA PARA LOGIN SE NECESSÁRIO.
 */
function verificarAcesso(): boolean {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
}
