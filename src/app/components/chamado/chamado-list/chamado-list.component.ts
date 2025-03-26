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
  displayedColumns: string[] = ['id', 'cliente', 'tecnico', 'tipo', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);


  // FORMATAÇÃO DO NÚMERO DO CHAMADO
  formatarId(id: number): string {
    const anoAtual = new Date().getFullYear(); 
    const idFormatado = id.toString().padStart(4, '0');
    return `${idFormatado}/${anoAtual}`;
  }

  // REFERÊNCIA DO PAGINATOR
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // FILTROS SELECIONADOS
  selectedStatus: number | null = null;
  selectedPrioridade: number | null = null;
  selectedTipo: number | null = null;

  filterText: string = '';

  // INICIALIZAÇÃO DO FILTRO OCULTO
  mostrarFiltros: boolean = false;

  // VISIBILIDADE DO FILTRO
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
      return `Total: ${length}  `;
    };
  }

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.findAll();
    this.dataSource.filterPredicate = (data: Chamado, filter: string) => {
      filter = filter.trim().toLowerCase();
      return (
        data.id.toString().includes(filter) ||
        data.nomeCliente.toLowerCase().includes(filter) ||
        data.nomeTecnico.toLowerCase().includes(filter) ||
        this.retornaStatus(data.status).toLowerCase().includes(filter) ||
        this.retornaPrioridade(data.prioridade).toLowerCase().includes(filter) ||
        this.retornaTipo(data.tipo).toLowerCase().includes(filter)
        
      );
    };
  }

  // MÉTODO PARA BUSCAR TODOS OS CHAMADOS
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

  // MÉTODO PARA APLICAR OS FILTROS SELECIONADOS
  applyFilters(): void {
  this.FILTERED_DATA = this.ELEMENT_DATA.filter(element => {
    const matchesStatus = this.selectedStatus === null || Number(element.status) === this.selectedStatus;
    const matchesPrioridade = this.selectedPrioridade === null || this.selectedPrioridade === Number(element.prioridade);

    // TRATA OS ACENTOS
    const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Adicionando a comparação de tipo diretamente
    const matchesTipo = this.selectedTipo === null || Number(element.tipo) === this.selectedTipo;

    const matchesText = this.filterText === '' ||
      normalizeText(element.nomeCliente).includes(normalizeText(this.filterText)) ||
      normalizeText(element.nomeTecnico).includes(normalizeText(this.filterText)) ||
      normalizeText(this.retornaStatus(element.status)).includes(normalizeText(this.filterText)) ||
      normalizeText(this.retornaPrioridade(element.prioridade)).includes(normalizeText(this.filterText)) ||
      normalizeText(this.retornaTipo(element.tipo)).includes(normalizeText(this.filterText));

    return matchesStatus && matchesPrioridade && matchesTipo && matchesText;
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

  // ORDENA PELO TIPO SELECIONADO
  orderByTipo(tipo: number | null): void {
    this.selectedTipo = tipo;
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

  // RETORNA A DESCRIÇÃO DA PRIORIDADE
  retornaTipo(tipo: number | string): string {
    const tipoMap: { [key: number]: string } = {
      0: 'Instalação',
      1: 'Reparo',
      2: 'Financeiro',
      3: 'Cancelamento'
    };
    return tipoMap[Number(tipo)] || 'Desconhecido';
  }
}
