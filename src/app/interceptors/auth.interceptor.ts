// INTERCEPTOR DE AUTENTICAÇÃO PARA ADICIONAR O TOKEN NAS REQUISIÇÕES E TRATAR ERROS DE AUTENTICAÇÃO

import { Injectable } from '@angular/core'; 
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()  // Declara que o serviço pode ser injetado em outros componentes
export class AuthInterceptor implements HttpInterceptor {  // Implementa o HttpInterceptor para interceptar requisições HTTP

  // Construtor com injeção de dependência para o Router e ToastrService
  constructor(private router: Router, private toastr: ToastrService) {}

  /**
   * INTERCEPTA A REQUISIÇÃO HTTP E ADICIONA O TOKEN DE AUTENTICAÇÃO, SE PRESENTE.
   * CASO HÁ ERROS, ELES SÃO TRATADOS AQUI.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  // Método intercepta todas as requisições HTTP
      const token = localStorage.getItem('token');  // Recupera o token de autenticação armazenado no localStorage

      if (token) {  // Se o token estiver presente
        const cloneReq = request.clone({  // Clona a requisição original para adicionar um cabeçalho com o token
          headers: request.headers.set('Authorization', `Bearer ${token}`)  // Adiciona o cabeçalho Authorization com o token
        });
        
        // Envia a requisição clonada com o cabeçalho de autorização e trata os erros com o handleError
        return next.handle(cloneReq).pipe(
          catchError((error) => this.handleError(error))  // Se houver erro, chama o método handleError
        );
      } 

      // Se o token não estiver presente, envia a requisição original sem modificações e trata os erros
      return next.handle(request).pipe(
        catchError((error) => this.handleError(error))  // Chama handleError caso haja erro
      );
  }

  /**
   * TRATA ERROS DE AUTENTICAÇÃO (401 E 403).
   * SE O ERRO FOR 403, MOSTRA UM ALERTA. SE FOR 401, REMOVER O TOKEN E REDIRECIONA PARA O LOGIN.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {  // Método que lida com erros de autenticação
    if (error.status === 403) {  // Se o erro for de permissão (status 403)
      const errorMessage = error.error?.message || 'Você não tem permissão para essa ação!';  // Obtém a mensagem do erro ou define uma padrão
      const isLoginPage = this.router.url.includes('/login');  // Verifica se o usuário está na página de login
  
      if (!isLoginPage) {  // Se não estiver na página de login
        this.toastr.warning(errorMessage, 'Acesso Negado');  // Exibe uma mensagem de alerta
      }
  
      return throwError(() => error);  // Lança o erro
    }
  
    if (error.status === 401) {  // Se o erro for de autenticação (status 401)
      localStorage.removeItem('token');  // Remove o token do localStorage, desconectando o usuário
      this.toastr.warning('Você foi desconectado. Por favor, faça login novamente.', 'Acesso Negado');  // Exibe uma mensagem de alerta
      this.router.navigate(['/login']);  // Redireciona para a página de login
    }
    return throwError(() => error);  // Lança o erro
  }
}
