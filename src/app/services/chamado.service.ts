import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chamado } from '../models/chamado';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  constructor(private http:HttpClient) { }

  // MÉTODO PARA CRIAR UM NOVO CHAMADO
  create (chamado: Chamado) {
    return this.http.post<Chamado>(`${API_CONFIG.baseUrl}/chamados`, chamado);
  }
  
  // MÉTODO PARA LISTAR TODOS OS CHAMADOS
  findAll(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${API_CONFIG.baseUrl}/chamados`);
  }

  // MÉTODO PARA CAPTURAR AS INFORMAÇÕES DO CHAMADO PELO ID
  findById(id: any): Observable<Chamado> {
    return this.http.get<Chamado>(`${API_CONFIG.baseUrl}/chamados/${id}`);
  }
  
  // MÉTODO PARA ATUALIZAR UM CHAMADO
  update (chamado: Chamado): Observable<Chamado> {
    return this.http.put<Chamado>(`${API_CONFIG.baseUrl}/chamados/${chamado.id}`, chamado);
  }

}
