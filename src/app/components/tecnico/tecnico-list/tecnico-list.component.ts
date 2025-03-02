import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Tecnico } from '../../../models/tecnico';
import { TecnicoService } from '../../../services/tecnico.service';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {

  ELEMENT_DATA: Tecnico[] = []
  displayedColumns: string[] = ['nome', 'cpf', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginatorIntl.itemsPerPageLabel = ''; 
    this.paginatorIntl.getRangeLabel = () => '';
  }

  ngOnInit(): void {
    this.findAll();
  }

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAll() {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

 // APLICA OS FILTROS PARA CONSULTA
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  
    this.dataSource.filter = filterValue;
  }
}
