import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Credenciais } from '../models/credenciais';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Realiza a autenticação do usuário
  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  // Salva o token e o email no localStorage
  successfulLogin(authToken: string, email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', authToken);
      localStorage.setItem('userEmail', email);  // Salva o email no localStorage
    }
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token ? !this.jwtService.isTokenExpired(token) : false;
    }
    return false;
  }

  // Limpa o token e o email ao sair
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  // Recupera o email do usuário armazenado
  getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userEmail');
    }
    return null;
  }

  // Recupera o token armazenado
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
