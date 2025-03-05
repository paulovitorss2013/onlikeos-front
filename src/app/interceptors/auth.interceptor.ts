import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('token');

      if (token) {
        const cloneReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(cloneReq).pipe(
          catchError((error) => this.handleError(error))
        );
      } 

      return next.handle(request).pipe(
        catchError((error) => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 403) {
      const errorMessage = error.error?.message || 'Você não tem permissão para essa ação!';
      const isLoginPage = this.router.url.includes('/login');
  
      if (!isLoginPage) {
        this.toastr.warning(errorMessage, 'Acesso Negado');
      }
  
      return throwError(() => error);
    }
  
    if (error.status === 401) {
      localStorage.removeItem('token');
      this.toastr.warning('Você foi desconectado. Por favor, faça login novamente.', 'Acesso Negado');
      this.router.navigate(['/login']);
    }
  
    return throwError(() => error);
  }
}
