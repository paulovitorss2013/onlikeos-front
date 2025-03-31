import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { FormControl, FormGroup } from '@angular/forms';
import { ChamadoService } from '../../../services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { TecnicoService } from '../../../services/tecnico.service';


@Component({
  selector: 'app-chamado-read',
  templateUrl: './chamado-read.component.html',
  styleUrl: './chamado-read.component.css'
})
export class ChamadoReadComponent implements OnInit {

  // INSTÂNCIA DO CHAMADO
  chamado: Chamado = {
    id: '',
    tipo: '',
    dataAbertura: '',
    prioridade: '',
    status: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
    dataFechamento: '',
    observacoes: '',
    procedimentos: ''
  };

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    tipo: new FormControl({ value: '', disabled: true }),
    dataAbertura: new FormControl({ value: '', disabled: true }),
    prioridade: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '', disabled: true }),
    tecnico: new FormControl({ value: '', disabled: true }),
    cliente: new FormControl({ value: '', disabled: true }),
    dataFechamento: new FormControl({ value: '', disabled: true }),
    observacoes: new FormControl({ value: '', disabled: true }),
    procedimentos: new FormControl({ value: '', disabled: true }),
    dadosCliente: new FormControl({ value: '', disabled: true }),
  });

  // CONSTRUTOR
  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chamado.id = id;
      this.findById();
    }
  }

 // MÉTODO ALTERADO PARA BUSCAR O TÉCNICO E O CLIENTE
findById(): void {
  this.chamadoService.findById(this.chamado.id).subscribe({
    next: (resposta) => {
      this.chamado = resposta;
      if (this.chamado.cliente) {
        this.shearchDataCliente(this.chamado.cliente);
      }
      if (this.chamado.tecnico) {
        this.shearchDataTecnico(this.chamado.tecnico);
      }
      this.updateForm();
    },
    error: (ex) => {
      this.toastrService.error(ex.error.error);
    }
  });
}

// MÉTODO PARA BUSCAR OS DADOS DO CLIENTE
shearchDataTecnico(tecnicoId: string): void {
  this.tecnicoService.findById(tecnicoId).subscribe({
    next: (tecnico) => {
      this.chamado.tecnico = tecnico;
      this.updateForm();
    },
    error: (ex) => {
      console.error('Erro ao buscar cliente:', ex);
      this.toastrService.error('Erro ao carregar os dados do cliente.');
    }
  });
}

  // MÉTODO PARA BUSCAR OS DADOS DO CLIENTE
  shearchDataCliente(clienteId: string): void {
    this.clienteService.findById(clienteId).subscribe({
      next: (cliente) => {
        this.chamado.cliente = cliente;
        this.updateForm();
      },
      error: (ex) => {
        console.error('Erro ao buscar cliente:', ex);
        this.toastrService.error('Erro ao carregar os dados do cliente.');
      }
    });
  }

  // APLICANDO A MÁSCARA PARA CELULAR E TELEFONE
  aplicarMascaraDadosCliente(valor: string, tipo: 'celular' | 'telefone'): string {
    if (tipo === 'celular') {
      return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
    }
    if (tipo === 'telefone') {
      return valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1)$2-$3');
    }
    return valor;
  } 

  // ATUALIZAÇÃO DO FORMULÁRIO
 updateForm(): void {
    const procedimentos = this.chamado.procedimentos?.trim() || 'Nenhum procedimento registrado para esse chamado.';
  
 // INFORMAÇÕES PARA DADOS DO CLIENTE
 const dadosCliente = this.chamado.cliente ? 
    `${this.chamado.cliente.celular ? `Celular: ${this.aplicarMascaraDadosCliente(this.chamado.cliente.celular, 'celular')}` : 'Celular: Não informado.'}\n` +
    `${this.chamado.cliente.telefone ? `Telefone: ${this.aplicarMascaraDadosCliente(this.chamado.cliente.telefone, 'telefone')}` : 'Telefone: Não informado.'}\n` +
    `${this.chamado.cliente.logradouro ? `Logradouro: ${this.chamado.cliente.logradouro}.` : 'Logradouro: Não informado.'}\n` +
    `${this.chamado.cliente.numero ? `Número: ${this.chamado.cliente.numero}.` : 'Número: Não informado.'}\n` +
    `${this.chamado.cliente.bairro ? `Bairro: ${this.chamado.cliente.bairro}.` : 'Bairro: Não informado.'}\n` +
    `${this.chamado.cliente.municipio ? `Município: ${this.chamado.cliente.municipio}.` : 'Município: Não informado.'}\n` +
    `${this.chamado.cliente.uf ? `Estado: ${this.chamado.cliente.uf}.` : 'Estado: Não informado.'}\n` +
    `${this.chamado.cliente.coordenada ? `Localização: ${this.chamado.cliente.coordenada}` : 'Localização: Não informada.'}` 
  : 'Dados do cliente não encontrados.';

    this.form.patchValue({
      id: this.chamado.id,
      tipo: this.chamado.tipo.toString(),
      dataAbertura: this.chamado.dataAbertura,
      prioridade: this.chamado.prioridade.toString(),
      status: this.chamado.status.toString(),
      tecnico: this.formatTecnico(),
      cliente: this.formatCliente(),
      dataFechamento: this.chamado.dataFechamento,
      observacoes: this.chamado.observacoes,
      procedimentos: procedimentos,
      dadosCliente: dadosCliente
    });
  }

// FORMATAR CPF DO TÉCNICO
private formatCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

// FORMATAR DADOS DO TÉCNICO
private formatTecnico(): string {
  const cpfCnpj = this.chamado.tecnico?.cpfCnpj
    ? ` - CPF: ${this.formatCPF(this.chamado.tecnico.cpfCnpj)}`
    : '';
  return `${this.chamado.nomeTecnico}${cpfCnpj}`;
}

// FORMATAR DADOS DO CLIENTE
private formatCliente(): string {
  const login = this.chamado.cliente?.login ? ` - PPPoE: ${this.chamado.cliente.login}` : '';
  return `${this.chamado.nomeCliente}${login}`;
}

// MÉTODO PARA FORMATAR O ID
formatId(id: string | number): string {
  if (!id) return ''; // Evita erro caso o ID seja indefinido ou nulo
  const anoCorrente = new Date().getFullYear(); // Obtém o ano atual
  return `${String(id).padStart(4, '0')}/${anoCorrente}`;
}

 // MÉTODO PARA ABRIR GOOGLE MAPS
  openGoogleMaps(coordenada: string): void {
  const isGoogleMapsLink = coordenada.startsWith('https://maps.app.goo.gl/');
  if (isGoogleMapsLink) {
    window.open(coordenada, '_blank');
  } else {
    const url = `https://www.google.com/maps?q=${coordenada}`;
    window.open(url, '_blank');
  }
}
  // VOLTA PARA A TELA DOS CHAMADOS
  return(): void {
    this.router.navigate(['chamados']);
  }
}
