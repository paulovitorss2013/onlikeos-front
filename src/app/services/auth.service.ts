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

  // REALIZA A AUTENTICAÇÃO DO USUÁRIO
  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  // SALVA O TOKEN E O E-MAIL NO LOCAL STORAGE
  successfulLogin(authToken: string, email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', authToken);
      localStorage.setItem('userEmail', email);
    }
  }

  // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token ? !this.jwtService.isTokenExpired(token) : false;
    }
    return false;
  }

  // LIMPA O TOKEN E O E-MAIL AO SAIR
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  // RECUPERA O E-MAIL DO USUÁRIO ARMAZENADO
  getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userEmail');
    }
    return null;
  }

  // RECUPERA O TOKEN ARMAZENADO
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
