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
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css'] // CORREÇÃO DE styleUrl PARA styleUrls
})
export class ChamadoCreateComponent implements OnInit {

  // VARIÁVEL PARA O CONTATOR DAS OBSERVAÇÕES
  observacoesCount: number = 0;

  // INSTÂNCIA DO CHAMADO
  chamado: Chamado = {
    tipo: '',
    prioridade: '',
    status: '',
    observacoes: '',
    procedimentos: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
    regiaoCliente:''
  }

  // DECLARAÇÃO DOS ARRAYS DE CLIENTE E
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    tipo: new FormControl('', [Validators.required]),
    prioridade: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    observacoes: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
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
    private dialog: MatDialog
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
    this.syncChamadoComFormulario(); // SINCRONIZA OS DADOS DIGITADOS COM O OBJETO CHAMADO
  }

  // FORMATANDO CPF E CNPJ
  formatCpfCnpj(valor: string): string {
    if (!valor) return '';
    const cleaned = valor.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
  }

// MÉTODO PARA LISTAR TODOS OS CLIENTES + CPF/CNPJ
findAllClientes(): void {
  this.clienteService.findAll().subscribe(resposta => {
    this.clientes = resposta.map(cli => ({
      ...cli,
      displayName: `${cli.nome} - ${cli.login}`
    }));
   });
 }
  
// MÉTODO PARA LISTAR TODOS OS TÉCNICOS + CPF/CNPJ
 findAllTecnicos(): void {
  this.tecnicoService.findAll().subscribe(resposta => {
    this.tecnicos = resposta.map(tec => ({
      ...tec,
      displayName: `${tec.nome} - ${tec.cpfCnpj}`
    }));
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
  this.chamadoService.create(this.chamado).subscribe({
    next: (resposta) => {
      this.toastrService.success('Chamado criado com sucesso!', 'Novo Chamado');
      this.router.navigate(['chamados']);
    },
    error: (ex) => {
      if (ex.error?.errors) {
        ex.error.errors.forEach((err: { message: string }) => {
          this.toastrService.error(err.message, 'Erro de Validação');
        });
      } else {
        const errorMsg = ex.error?.message || ex.error?.error || 'Erro ao criar chamado';
        this.toastrService.error(errorMsg, 'Erro');
      }
    }
  });
}

// CONTADOR DAS OBSERVAÇÕES
updateObservacoesCount(): void {
  const observacoes = this.form.get('observacoes')?.value || '';
  this.observacoesCount = observacoes.length;
}

// MÉTODO PARA CANCELAR AS AÇÕES
    cancelActions(): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { message: 'Tem certeza que deseja cancelar a criação?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['chamados']);
        }
      });
    }

// MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validField(): boolean {
    return this.form.valid;
  }
}
