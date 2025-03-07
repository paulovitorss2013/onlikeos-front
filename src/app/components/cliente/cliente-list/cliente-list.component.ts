import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})

// DADOS ORIGINAIS E FILTRADOS
export class ClienteListComponent implements OnInit {
  ELEMENT_DATA: Cliente[] = [];

  // COLUNAS DA TABELA
  displayedColumns: string[] = ['nome', 'cpfCnpj', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

   // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
    this.paginatorIntl.firstPageLabel = 'Primeira página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.nextPageLabel = 'Próxima página';
    this.paginatorIntl.lastPageLabel = 'Última página';

    this.paginatorIntl.itemsPerPageLabel = '';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      return `${length} cliente(s) encontrado(s)`;
    };
  }

  ngOnInit(): void {
    this.findAll();
  }

  // MÉTODO PARA LISTAR TODOS OS CLIENTES
  findAll() {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);
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

  // MÉTODO PARA APLICAR A MÁSCARA PARA O CPF OU CNPJ
  applyMask(cpfCnpj: string): string {
    cpfCnpj = cpfCnpj.replace(/\D/g, '');
    if (cpfCnpj.length === 11) {
      // CPF
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
      // CNPJ
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj; 
  }
}
