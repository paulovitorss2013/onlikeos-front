import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Tecnico } from '../../../models/tecnico';
import { TecnicoService } from '../../../services/tecnico.service';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {

  // DADOS ORIGINAIS E FILTRADOS
  ELEMENT_DATA: Tecnico[] = [];

  // COLUNAS DA TABELA
  displayedColumns: string[] = ['nome', 'cpf', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
    this.paginatorIntl.firstPageLabel = 'Primeira página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.nextPageLabel = 'Próxima página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    
    this.paginatorIntl.itemsPerPageLabel = ''; 
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      return `Exibindo ${length} técnicos encontrados`;
    };
  }

  ngOnInit(): void {
    this.findAll();
  }

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAll() {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.updateDataSource();
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

    // ATUALIZA O PAGINATOR APÓS A FILTRAGEM
    this.updateDataSource();
  }

  // ATUALIZA OS DADOS DA TABELA E CONFIGURA O PAGINADOR
  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;

    // ATUALIZA A EXIBIÇÃO DO TOTAL NO PAGINATOR
    this.paginatorIntl.changes.next();
  }
}
