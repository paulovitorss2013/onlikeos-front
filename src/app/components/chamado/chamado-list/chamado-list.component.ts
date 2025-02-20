import { Component, OnInit, ViewChild } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrl: './chamado-list.component.css'
})
export class ChamadoListComponent implements OnInit {
  
  ELEMENT_DATA: Chamado[] = [
    
    {
      id: 1,
      dataAbertura: '20/02/2025',
      dataFechamento:'20/02/2025',
      prioridade: 'ALTA',
      status: 'ANDAMENTO',
      titulo: 'Chamado Teste',
      descricao: 'Reconfigurar roteador do cliente',
      tecnico: '1',
      cliente: '2',
      nomeTecnico: 'Paulo Vitor',
      nomeCliente:'Rogério Alves'
    }
    
  ]
  displayedColumns: string[] = ['id','titulo', 'cliente', 'tecnico','dataAbertura', 'prioridade','status'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
