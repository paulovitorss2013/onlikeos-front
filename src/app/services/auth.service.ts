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
  
  // DECLARAÇÃO DA VARIÁVEL DO JWT
  jwtService: JwtHelperService = new JwtHelperService();

  // CONSTRUTOR
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // INJETA O IDENTIFICADOR DA PLATAFORMA
  ) {}

  // REALIZA A AUTENTICAÇÃO DO USUÁRIO
  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  // SALVA O TOKEN NO LOCAL STORAGE (VERIFICA SE ESTÁ NO NAVEGADOR)
  successfulLogin(authToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', authToken);
    }
  }

  // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO (VERIFICA SE ESTÁ NO NAVEGADOR)
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token ? !this.jwtService.isTokenExpired(token) : false;
    }
    return false;
  }

  // MÉTODO PARA LIMPAR O TOKEN AO SAIR DO SISTEMA (VERIFICA SE ESTÁ NO NAVEGADOR)
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
  
}
