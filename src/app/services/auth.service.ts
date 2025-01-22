import { Injectable } from '@angular/core';
import { Credenciais } from '../models/credenciais';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // REALIZA A AUTENTICAÇÃO DO USUÁRIO
  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  // SALVA O TOKEN NO LOCAL STORAGE
  successfulLogin(authToken: string): void {
    localStorage.setItem('token', authToken);
  }

  // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
  isAuthenticate(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtService.isTokenExpired(token) : false;
  }

  // MÉTODO PARA LIMPAR O TOKEN AO SAIR DO SISTEMA
  logout () {
    localStorage.clear();
  }
}
