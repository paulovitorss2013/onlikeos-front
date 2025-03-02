import { Component, OnInit, ViewChild } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ChamadoService } from '../../../services/chamado.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  // DADOS ORIGINAIS E FILTRADOS
  ELEMENT_DATA: Chamado[] = [];
  FILTERED_DATA: Chamado[] = [];

  // COLUNAS DA TABELA
  displayedColumns: string[] = ['id', 'cliente', 'tecnico', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // FILTROS SELECIONADOS
  selectedStatus: number | null = null;
  selectedPrioridade: number | null = null;
  filterText: string = '';

  mostrarFiltros: boolean = false;

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  // CONSTRUTOR
  constructor(private service: ChamadoService, private paginatorIntl: MatPaginatorIntl) {

     
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
    this.paginatorIntl.firstPageLabel = 'Primeira página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.nextPageLabel = 'Próxima página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    
    this.paginatorIntl.itemsPerPageLabel = '';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      return `${length} chamado(s) encontrado(s)`;
    };
  }

  ngOnInit(): void {
    this.findAll();
    
    // Define um filtro personalizado
    this.dataSource.filterPredicate = (data: Chamado, filter: string) => {
      filter = filter.trim().toLowerCase();
  
      return (
        data.id.toString().includes(filter) ||
        data.titulo.toLowerCase().includes(filter) ||
        data.nomeCliente.toLowerCase().includes(filter) ||
        data.nomeTecnico.toLowerCase().includes(filter) ||
        this.retornaStatus(data.status).toLowerCase().includes(filter) ||
        this.retornaPrioridade(data.prioridade).toLowerCase().includes(filter)
        
      );
    };
  }

  // BUSCA TODOS OS CHAMADOS
  findAll(): void {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.FILTERED_DATA = resposta;
      this.updateDataSource();
    });
  }
  
  // ATUALIZA OS DADOS DA TABELA E CONFIGURA O PAGINADOR
  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA);
    this.dataSource.paginator = this.paginator;
  }

  // APLICA OS FILTROS SELECIONADOS
  applyFilters(): void {
    this.FILTERED_DATA = this.ELEMENT_DATA.filter(element => {
      const matchesStatus = this.selectedStatus === null || Number(element.status) === this.selectedStatus;
      const matchesPrioridade = this.selectedPrioridade === null || this.selectedPrioridade === Number(element.prioridade);
  
      // Função para remover acentos
      const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
      const matchesText = this.filterText === '' ||
        normalizeText(element.titulo).includes(normalizeText(this.filterText)) ||
        normalizeText(element.nomeCliente).includes(normalizeText(this.filterText)) ||
        normalizeText(element.nomeTecnico).includes(normalizeText(this.filterText)) ||
        normalizeText(this.retornaStatus(element.status)).includes(normalizeText(this.filterText)) ||
        normalizeText(this.retornaPrioridade(element.prioridade)).includes(normalizeText(this.filterText));
  
      return matchesStatus && matchesPrioridade && matchesText;
    });
  
    this.updateDataSource();
  }

  // ORDENA PELO STATUS SELECIONADO
  orderByStatus(status: number | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  // ORDENA PELA PRIORIDADE SELECIONADA
  orderByPrioridade(prioridade: number | null): void {
    this.selectedPrioridade = prioridade;
    this.applyFilters();
  }

 // APLICA OS FILTROS PARA CONSULTA
 applyFilter(event: Event) {
  this.filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.applyFilters();
}

  
  // RETORNA A DESCRIÇÃO DO STATUS
  retornaStatus(status: number | string): string {
    const statusMap: { [key: number]: string } = {
      0: 'Aberto',
      1: 'Em Andamento',
      2: 'Encerrado'
    };
    return statusMap[Number(status)] || 'Desconhecido';
  }

  // RETORNA A DESCRIÇÃO DA PRIORIDADE
  retornaPrioridade(prioridade: number | string): string {
    const prioridadeMap: { [key: number]: string } = {
      0: 'Baixa',
      1: 'Média',
      2: 'Alta'
    };
    return prioridadeMap[Number(prioridade)] || 'Desconhecida';
  }
}
