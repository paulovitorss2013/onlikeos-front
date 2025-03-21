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
    titulo: '',
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
    titulo: new FormControl({ value: '', disabled: true }),
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

  atualizarFormulario(): void {
    const procedimentos = this.chamado.procedimentos?.trim() || 'Nenhum procedimento registrado para esse chamado.';
  
 // INFORMAÇÕES PARA DADOS DO CLIENTE
 const dadosCliente = this.chamado.cliente ? 
 `${this.chamado.cliente.celular ? `Celular: ${this.aplicarMascara(this.chamado.cliente.celular, 'celular')}` : ''}\n` +
 `${this.chamado.cliente.telefone ? `Telefone: ${this.aplicarMascara(this.chamado.cliente.telefone, 'telefone')}` : ''}\n` +
 `${this.chamado.cliente.logradouro ? `Logradouro: ${this.chamado.cliente.logradouro}` : ''}\n` +
 `${this.chamado.cliente.numero ? `Número: ${this.chamado.cliente.numero}` : ''}\n` +
 `${this.chamado.cliente.bairro ? `Bairro: ${this.chamado.cliente.bairro}` : ''}\n` +
 `${this.chamado.cliente.municipio ? `Município: ${this.chamado.cliente.municipio}` : ''}\n` +
 `${this.chamado.cliente.uf ? `Estado: ${this.chamado.cliente.uf}` : ''}\n` +
 `${this.chamado.cliente.coordenada ? `Coordenadas: ${this.chamado.cliente.coordenada}` : ''}`
 : 'Dados do cliente não encontrados.';


    this.form.patchValue({
      titulo: this.chamado.titulo,
      dataAbertura: this.chamado.dataAbertura,
      prioridade: this.chamado.prioridade.toString(),
      status: this.chamado.status.toString(),
      tecnico: this.chamado.nomeTecnico,
      cliente: this.chamado.nomeCliente,
      dataFechamento: this.chamado.dataFechamento,
      observacoes: this.chamado.observacoes,
      procedimentos: procedimentos,
      dadosCliente: dadosCliente
    });
  }

  aplicarMascara(valor: string, tipo: 'celular' | 'telefone'): string {
    if (tipo === 'celular') {
      return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3'); // Mascara de celular
    }
    if (tipo === 'telefone') {
      return valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1)$2-$3'); // Mascara de telefone fixo
    }
    return valor;
  }

 // MÉTODO PARA ABRIR GOOGLE MAPS
  abrirNoGoogleMaps(coordenada: string): void {
  const isGoogleMapsLink = coordenada.startsWith('https://maps.app.goo.gl/');
  if (isGoogleMapsLink) {
    window.open(coordenada, '_blank');
  } else {
    // Se for uma coordenada simples, abre no Google Maps
    const url = `https://www.google.com/maps?q=${coordenada}`;
    window.open(url, '_blank');
  }
}
  // VOLTA PARA A TELA DOS CHAMADOS
  voltar(): void {
    this.router.navigate(['chamados']);
  }
}
