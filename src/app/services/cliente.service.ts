import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable, retry } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }
  
  // MÉTODO PARA BUSCAR O TÉCNICO PELO ID
  findById(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${API_CONFIG.baseUrl}/clientes/${id}`);
  }

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${API_CONFIG.baseUrl}/clientes`);
  }

  // MÉTODO PARA CRIAR UM TÉCNICO
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${API_CONFIG.baseUrl}/clientes`, cliente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // MÉTODO PARA ATUALIZAR UM TÉCNICO
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${API_CONFIG.baseUrl}/clientes/${cliente.id}`, cliente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // MÉTODO PARA DELETAR UM TÉCNICO
  delete (id: any): Observable <Cliente> {
    return this.http.delete<Cliente>(`${API_CONFIG.baseUrl}/clientes/${id}`);
  }
}
