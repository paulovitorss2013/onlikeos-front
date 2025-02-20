import { Component, OnInit, ViewChild } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ChamadoService } from '../../../services/chamado.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {
  
  ELEMENT_DATA: Chamado[] = [];
  FILTERED_DATA: Chamado[] = [];

  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'dataAbertura', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedStatus: number | null = null;
  selectedPrioridade: number | null = null;
  filterText: string = '';

  constructor(private service: ChamadoService) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.FILTERED_DATA = resposta;
      this.updateDataSource();
    });
  }

  applyFilters(): void {
    this.FILTERED_DATA = this.ELEMENT_DATA.filter(element => {
      const matchesStatus = this.selectedStatus === null || Number(element.status) === this.selectedStatus;
      const matchesPrioridade = this.selectedPrioridade === null || Number(element.prioridade) === this.selectedPrioridade;
      const matchesText = this.filterText === '' || 
        element.titulo.toLowerCase().includes(this.filterText.toLowerCase()) || 
        element.nomeCliente.toLowerCase().includes(this.filterText.toLowerCase()) || 
        element.nomeTecnico.toLowerCase().includes(this.filterText.toLowerCase());

      return matchesStatus && matchesPrioridade && matchesText;
    });

    this.updateDataSource();
  }

  orderByStatus(status: number | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  orderByPrioridade(prioridade: number | null): void {
    this.selectedPrioridade = prioridade;
    this.applyFilters();
  }

  applyFilter(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA);
    this.dataSource.paginator = this.paginator;
  }

  retornaStatus(status: number | string): string {
    const statusMap: { [key: number]: string } = {
      0: 'ABERTO',
      1: 'EM ANDAMENTO',
      2: 'ENCERRADO'
    };
    return statusMap[Number(status)] || 'DESCONHECIDO';
  }

  retornaPrioridade(prioridade: number | string): string {
    const prioridadeMap: { [key: number]: string } = {
      0: 'BAIXA',
      1: 'MÉDIA',
      2: 'ALTA'
    };
    return prioridadeMap[Number(prioridade)] || 'DESCONHECIDA';
  }
}
