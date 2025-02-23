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

  // MÉTODO PARA LISTAR TODOS OS CHAMADOS
  findAll(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${API_CONFIG.baseUrl}/chamados`);
  }

  // MÉTODO PARA CRIAR UM CHAMADO
  create (Chamado: Chamado) {
    return this.http.post<Chamado>(`${API_CONFIG.baseUrl}/chamados`, Chamado);
  }
}
