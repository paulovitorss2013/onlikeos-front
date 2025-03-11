import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente';
import { Tecnico } from '../../../models/tecnico';
import { Chamado } from '../../../models/chamado';
import { ChamadoService } from '../../../services/chamado.service';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrl: './chamado-update.component.css'
})
export class ChamadoUpdateComponent implements OnInit {

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

  // DECLARAÇÃO DOS ARRAYS DE CLIENTE E TÉCNICOS
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
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chamado.id = id;
      this.findById();
    }
    this.findAllClientes();
    this.findAllTecnicos();
    this.syncChamadoComFormulario();
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

  /// MÉTODO BUSCAR AS INFORMAÇÕES PELO ID
  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe({
      next: (resposta) => {
        this.chamado = resposta;
        this.form.patchValue({
          titulo: this.chamado.titulo,
          prioridade: this.chamado.prioridade.toString(), 
          status: this.chamado.status.toString(),
          observacoes: this.chamado.observacoes,
          tecnico: this.chamado.tecnico,
          cliente: this.chamado.cliente
        });
      },
      error: (ex) => {
        this.toastrService.error(ex.error.error);
      }
    });
  }

  // MÉTODO PARA CRIAR UM CHAMADO
  update(): void {
    const chamadoAtualizado = { ...this.chamado, ...this.form.value };
  
    this.chamadoService.update(chamadoAtualizado).subscribe({
      next: () => {
        this.toastrService.success('Chamado atualizado com sucesso!', 'Atualização');
        this.router.navigate(['chamados']);
      },
      error: (ex) => {
        this.toastrService.error(ex.error?.error || 'Erro ao atualizar chamado');
      }
    });
  }

  // MÉTODO CANCELAR AS AÇÕES
  cancelar(): void {
    this.router.navigate(['chamados']);
}

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
