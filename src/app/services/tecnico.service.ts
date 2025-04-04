import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable, retry } from 'rxjs';
import { Tecnico } from '../models/tecnico';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  // CONSTRUTOR
  constructor(private http: HttpClient) { }

  // MÉTODO PARA CRIAR UM TÉCNICO
  create(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.post<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos`, tecnico, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    }
  
  // MÉTODO PARA VERIFICAR CPF DUPLICADO
  existsByCpfCnpj(cpfCnpj: string): Observable<boolean> {
    return this.http.get<boolean>(`${API_CONFIG.baseUrl}/tecnicos/exists/cpf/${cpfCnpj}`);
  }

  // MÉTODO PARA VERIFICAR E-MAIL DUPLICADO
  existsByEmail(email: string): Observable<boolean> {
  return this.http.get<boolean>(`${API_CONFIG.baseUrl}/tecnicos/exists/email/${email}`);
}

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAll(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(`${API_CONFIG.baseUrl}/tecnicos`);
  }

  // MÉTODO PARA BUSCAR AS INFORMAÇÕES DO TÉCNICO PELO ID
  findById(id: any): Observable<Tecnico> {
    return this.http.get<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos/${id}`);
  }

  // MÉTODO PARA ATUALIZAR UM TÉCNICO
  update(tecnico: Tecnico): Observable<Tecnico> {
    return this.http.put<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos/${tecnico.id}`, tecnico, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // MÉTODO PARA DELETAR UM TÉCNICO
  delete (id: any): Observable <Tecnico> {
    return this.http.delete<Tecnico>(`${API_CONFIG.baseUrl}/tecnicos/${id}`);
  }
  
}
