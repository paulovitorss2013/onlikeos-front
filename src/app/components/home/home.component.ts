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

// DIRECIONA PARA MEUS CHAMADOS
listarMeusChamados(): void {
  this.router.navigate(['chamados-my-list']);
 }

  // DIRECIONA PARA LISTAR TODOS OS TÉCNICOS
listarTecnicos(): void {
  this.router.navigate(['tecnicos']);
 } 

// DIRECIONA PARA LISTAR TODOS OS CHAMADOS
listarClientes(): void {
  this.router.navigate(['clientes']);
 }

// DIRECIONA PARA LISTAR TODOS OS CHAMADOS
listarChamados(): void {
  this.router.navigate(['chamados']);
 }

}