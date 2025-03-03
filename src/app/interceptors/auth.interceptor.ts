import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let token = localStorage.getItem('token');

      if (token) {
        const cloneReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(cloneReq).pipe(
          catchError((error) => this.handleError(error, request.url))
        );
      } 

      return next.handle(request).pipe(
        catchError((error) => this.handleError(error, request.url))
      );
  }

  private handleError(error: HttpErrorResponse, requestUrl: string): Observable<never> {
    const isLoginPage = this.router.url.includes('/login'); // Verifica se está na tela de login

    if (error.status === 403) {
      if (isLoginPage) {
        // Se estiver na tela de login, significa que as credenciais estão erradas
        return throwError(() => error); // Deixa o `LoginComponent` lidar com a mensagem
      } else {
        localStorage.removeItem('token'); // Remove o token
        this.router.navigate(['/login']); // Redireciona para login
      }
    }
    return throwError(() => error);
  } 
}
