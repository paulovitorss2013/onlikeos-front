import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente';
import { Tecnico } from '../../../models/tecnico';
import { ClienteService } from '../../../services/cliente.service';
import { TecnicoService } from '../../../services/tecnico.service';
import { ChamadoService } from '../../../services/chamado.service';
import { Chamado } from '../../../models/chamado';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css'] // CORREÇÃO DE styleUrl PARA styleUrls
})
export class ChamadoCreateComponent implements OnInit {

  // INSTÂNCIA DO CHAMADO
  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    prioridade: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    observacoes: new FormControl('', [Validators.required, Validators.minLength(15)]),
    tecnico: new FormControl('', [Validators.required]),
    cliente: new FormControl('', [Validators.required])
  });

  // CONSTRUTOR
  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
    this.syncChamadoComFormulario(); // SINCRONIZA OS DADOS DIGITADOS COM O OBJETO CHAMADO
  }

  // MÉTODO PARA LISTAR TODOS OS CLIENTES
  findAllClientes(): void {
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta;
    });
  }

  // MÉTODO PARA LISTAR TODOS OS TÉCNICOS
  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    });
  }

  // MÉTODO PARA SINCRONIZAR O FORMULÁRIO COM O OBJETO CHAMADO
  syncChamadoComFormulario(): void {
    this.form.valueChanges.subscribe(values => {
      this.chamado = { ...this.chamado, ...values };
    });
  }

  // MÉTODO PARA CRIAR UM CHAMADO
  create(): void {
    this.chamadoService.create(this.chamado).subscribe(resposta => {
      this.toastService.success('Chamado criado com sucesso', 'Novo Chamado');
      this.router.navigate(['chamados']);
    }, ex => {
      this.toastService.error(ex.error.error);
    });
  }

  // MÉTODO PARA CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {
      console.log('Ação cancelada!');
    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
