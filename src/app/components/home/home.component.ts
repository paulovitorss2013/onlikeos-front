import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    
// CONSTRUTOR
  constructor(
    private router: Router,
  ) {}

// MÉTODO LISTAR TODOS OS TÉCNICOS
listarTecnicos(): void {
  this.router.navigate(['tecnicos']);
 } 

// MÉTODO NAVEGAR PARA LISTAR TODOS OS CHAMADOS
listarClientes(): void {
  this.router.navigate(['clientes']);
 }

// MÉTODO NAVEGAR PARA LISTAR TODOS OS CHAMADOS
listarChamados(): void {
  this.router.navigate(['chamados']);
 }

}