import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { FormControl, FormGroup } from '@angular/forms';
import { ChamadoService } from '../../../services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';

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

  // MÉTODO BUSCAR AS INFORMAÇÕES PELO ID
  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe({
      next: (resposta) => {
        this.chamado = resposta;
        if (this.chamado.cliente) {
          this.buscarDadosDoCliente(this.chamado.cliente);
        } else {
          this.atualizarFormulario();
        }
      },
      error: (ex) => {
        this.toastrService.error(ex.error.error);
      }
    });
  }

  // MÉTODO PARA BUSCAR OS DADOS DO CLIENTE
  buscarDadosDoCliente(clienteId: string): void {
    this.clienteService.findById(clienteId).subscribe({
      next: (cliente) => {
        this.chamado.cliente = cliente;
        this.atualizarFormulario();
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
  atualizarFormulario(): void {
    const procedimentos = this.chamado.procedimentos?.trim() || 'Nenhum procedimento registrado para esse chamado.';
  
 // INFORMAÇÕES PARA DADOS DO CLIENTE
 const dadosCliente = this.chamado.cliente ? 
    `${this.chamado.cliente.celular ? `Celular: ${this.aplicarMascaraDadosCliente(this.chamado.cliente.celular, 'celular')}` : 'Celular: Não informado'}\n` +
    `${this.chamado.cliente.telefone ? `Telefone: ${this.aplicarMascaraDadosCliente(this.chamado.cliente.telefone, 'telefone')}` : 'Telefone: Não informado'}\n` +
    `${this.chamado.cliente.logradouro ? `Logradouro: ${this.chamado.cliente.logradouro}` : 'Logradouro: Não informado'}\n` +
    `${this.chamado.cliente.numero ? `Número: ${this.chamado.cliente.numero}` : 'Número: Não informado'}\n` +
    `${this.chamado.cliente.bairro ? `Bairro: ${this.chamado.cliente.bairro}` : 'Bairro: Não informado'}\n` +
    `${this.chamado.cliente.municipio ? `Município: ${this.chamado.cliente.municipio}` : 'Município: Não informado'}\n` +
    `${this.chamado.cliente.uf ? `Estado: ${this.chamado.cliente.uf}` : 'Estado: Não informado'}\n` +
    `${this.chamado.cliente.coordenada ? `Coordenadas: ${this.chamado.cliente.coordenada}` : 'Coordenadas: Não informadas'}` 
  : 'Dados do cliente não encontrados.';

const anoCorrente = new Date().getFullYear();
const idFormatado = `${String(this.chamado.id).padStart(4, '0')}/${anoCorrente}`;

    this.form.patchValue({
      id: idFormatado,
      tipo: this.chamado.tipo.toString(),
      dataAbertura: this.chamado.dataAbertura,
      prioridade: this.chamado.prioridade.toString(),
      status: this.chamado.status.toString(),
      tecnico: this.formatarTecnico(),
      cliente: this.formatarCliente(),
      dataFechamento: this.chamado.dataFechamento,
      observacoes: this.chamado.observacoes,
      procedimentos: procedimentos,
      dadosCliente: dadosCliente
    });
  }

 // FORMATAR DADOS DO TÉCNICO
private formatarTecnico(): string {
  const cpfCnpj = this.chamado.tecnico?.cpfCnpj ? ` - CPF: ${this.chamado.tecnico.cpfCnpj}` : '';
  return `${this.chamado.nomeTecnico}${cpfCnpj}`;
}

// FORMATAR DADOS DO CLIENTE
private formatarCliente(): string {
  const login = this.chamado.cliente?.login ? ` - PPPoE: ${this.chamado.cliente.login}` : '';
  return `${this.chamado.nomeCliente}${login}`;
}

 // MÉTODO PARA ABRIR GOOGLE MAPS
  abrirNoGoogleMaps(coordenada: string): void {
  const isGoogleMapsLink = coordenada.startsWith('https://maps.app.goo.gl/');
  if (isGoogleMapsLink) {
    window.open(coordenada, '_blank');
  } else {
    const url = `https://www.google.com/maps?q=${coordenada}`;
    window.open(url, '_blank');
  }
}
  // VOLTA PARA A TELA DOS CHAMADOS
  voltar(): void {
    this.router.navigate(['chamados']);
  }
}
