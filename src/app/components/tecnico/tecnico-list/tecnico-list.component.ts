import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Tecnico } from '../../../models/tecnico';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css'] // Correção aqui
})
export class TecnicoListComponent implements OnInit, AfterViewInit {

  ELEMENT_DATA: Tecnico[] = [
    {
      id: 1,
      nome: 'Onlike',
      cpf: '123.456.789-10',
      email: 'onliketelecom@gmail.com',
      senha: '1234',
      perfils:['0'],
      dataCriacao: '01/01/2023'
    }
  ]

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}

