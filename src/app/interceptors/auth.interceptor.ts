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
        request = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
      } 

      return next.handle(request).pipe(catchError((error) => this.handleError(error))); // Aplicando o catchError uma única vez
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 403) {
      const errorMessage = error.error?.message || 'Você não tem permissão para essa ação!';
      if (!this.router.url.includes('/login')) {
        this.toastr.warning(errorMessage, 'Acesso Negado');
      }
    }
  
    if (error.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  
    return throwError(() => error);
  }
}
