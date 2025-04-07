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

   // VARIÁVEL DE CONTROLE DO CARREGAMENTO
   isLoading: boolean = true;

  // DADOS ORIGINAIS E FILTRADOS
  ELEMENT_DATA: Tecnico[] = [];

  // COLUNAS DA TABELA
  displayedColumns: string[] = ['nome', 'cpfCnpj', 'acoes'];
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
      return `Total: ${length}`;
    };
  }

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.findAll();
  }

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAll() {
    this.isLoading = true;
    this.service.findAll().subscribe({
      next: (resposta) => {
        this.ELEMENT_DATA = resposta;
        this.updateDataSource();
      },
      error: (err) => {
        console.error('Erro ao buscar técnicos:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
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

  // ATUALIZA OS DADOS DA TABELA E CONFIGURA O PAGINADOR
  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  
    // Customizando o filtro
    this.dataSource.filterPredicate = (data: Tecnico, filter: string) => {
      const nome = data.nome?.toLowerCase() || '';
      const email = data.email?.toLowerCase() || '';
      const cpf = (data.cpfCnpj || '').replace(/\D/g, '');
      const filtro = filter.toLowerCase();
  
      return nome.includes(filtro) ||
             email.includes(filtro) ||
             cpf.includes(filtro) ||
             (data.cpfCnpj?.toLowerCase().includes(filtro) || false);
    };
    this.paginatorIntl.changes.next();
  }
}
