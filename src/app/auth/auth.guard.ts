import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * VERIFICA SE O USUÁRIO PODE ATIVAR UMA ROTA PROTEGIDA.
   * SE NÃO ESTIVER AUTENTICADO, REDIRECIONA PARA A TELA DE LOGIN.
   */
  canActivate(): boolean | Observable<boolean> {
    return this.verificarAcesso();
  }

  /**
   * VERIFICA SE O USUÁRIO PODE CARREGAR MÓDULOS DE FORMA ASSÍNCRONA.
   */
  canLoad(): boolean | Observable<boolean> {
    return this.verificarAcesso();
  }

  /**
   * MÉTODO QUE VERIFICA A AUTENTICAÇÃO E REDIRECIONA PARA LOGIN SE NECESSÁRIO.
   */
  private verificarAcesso(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
