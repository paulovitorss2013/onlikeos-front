import { HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  // CONSTRUTOR DA CLASSE
  constructor() {}

  // MÉTODO PRINCIPAL QUE INTERCEPTA REQUISIÇÕES HTTP

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Pega o token do localStorage
      let token = localStorage.getItem('token');

      if (token) {
        // Clona a requisição e adiciona o cabeçalho Authorization com o token
        const cloneReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(cloneReq); // Passa a requisição clonada para o próximo handler
      } else {
        // Se não houver token, passa a requisição original sem alterações
        return next.handle(request);
      }
  }
}

// PROVEDOR PARA REGISTRAR O INTERCEPTOR
export const AuthInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS, // Define o token HTTP_INTERCEPTORS como chave
    useClass: AuthInterceptor, // Especifica a classe que será usada como interceptor
    multi: true // Permite múltiplos interceptores serem registrados
  }
];
