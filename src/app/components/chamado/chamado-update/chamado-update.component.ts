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
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrl: './chamado-update.component.css'
})
export class ChamadoUpdateComponent implements OnInit {

// VARIÁVEL DE CONTROLE DO CONTADOR DE CARACTERES DO NOVO PROCEDIMENTO E OBSERVAÇÕES
charCountText: number = 0;
observacoesCount: number = 0;

// VARIÁVEL DE CONTROLE DOS PROCEDIMENTOS
procedimentosBanco: string = '';
procedimentosTemp: string[] = [];

// INSTÂNCIA DO CHAMADO
chamado: Chamado = {
    id: '',
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

// DECLARAÇÃO DOS ARRAYS DE CLIENTE E TÉCNICOS
clientes: Cliente[] = [];
 tecnicos: Tecnico[] = [];

// GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    tipo: new FormControl('', [Validators.required]),
    prioridade: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    observacoes: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    procedimentos: new FormControl(''),
    novoProcedimento: new FormControl('', [Validators.minLength(10), Validators.maxLength(500)]),
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
    private authService: AuthService,
    private dialog: MatDialog
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

// MÉTODO PARA FORMATAR E CNPJ
formatCpf(cpf: string): string {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, ''); // Remove tudo que não for número
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Sempre formata como CPF
  }

// MÉTODO PARA BUSCAR TODOS OS CLIENTES
findAllClientes(): void {
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta;
    });
  }

// MÉTODO PARA BUSCAR TODOS OS TÉCNICOS
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

// MÉTODO PARA FORMATAR O ID
formatId(id: string | number): string {
    if (!id) return ''; // Evita erro caso o ID seja indefinido ou nulo
    const anoCorrente = new Date().getFullYear(); // Obtém o ano atual
    return `${String(id).padStart(4, '0')}/${anoCorrente}`;
  }

// MÉTODO PARA BUSCAR AS INFORMAÇÕES PELO ID
findById(): void {
  this.chamadoService.findById(this.chamado.id).subscribe({
    next: (resposta) => {
      this.chamado = resposta;

      const tecnico = this.tecnicos.find(tecnico => tecnico.id === this.chamado.tecnico);
      const cliente = this.clientes.find(cliente => cliente.id === this.chamado.cliente);

      this.chamado.nomeTecnico = tecnico ? `${tecnico.nome} - CPF/CNPJ: ${this.formatCpf(tecnico.cpfCnpj)}` : '';
      this.chamado.nomeCliente = cliente ? `${cliente.login} - PPPoE: ${cliente.login}` : '';

      // Procedimentos que vieram do banco
      const procedimentos = this.chamado.procedimentos?.trim() || 'Nenhum procedimento registrado para esse chamado.';
      this.procedimentosBanco = procedimentos === 'Nenhum procedimento registrado para esse chamado.'
        ? ''
        : procedimentos;

      // Limpa os temporários (caso esteja voltando do update ou reload da tela)
      this.procedimentosTemp = [];

      const idFormatado = this.formatId(this.chamado.id);

      this.form.patchValue({
        tipo: this.chamado.tipo.toString(),
        dataAbertura: this.chamado.dataAbertura,
        prioridade: this.chamado.prioridade.toString(),
        status: this.chamado.status.toString(),
        tecnico: this.chamado.tecnico,
        cliente: this.chamado.cliente,
        dataFechamento: this.chamado.dataFechamento,
        observacoes: this.chamado.observacoes,
        procedimentos: this.procedimentosBanco || 'Nenhum procedimento registrado para esse chamado.'
      });

      this.updateObservacoesCount();
    },
    error: (ex) => {
      this.toastrService.error(ex.error.error);
    }
  });
}

// MÉTODO PARA INCLUIR UM PROCEDIMENTO
insertProcedure(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { message: 'Deseja mesmo incluir novo procedimento?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const novoProcedimento = this.form.get('novoProcedimento')?.value?.trim().replace(/[ \t]+/g, ' ');

      if (novoProcedimento && novoProcedimento.length >= 10) {
        const emailTecnico = this.authService.getUserEmail() || 'Técnico desconhecido';
        const dataHoraAtual = this.getDataHoraAtual();
        const registro = `${emailTecnico} - ${dataHoraAtual} - ${novoProcedimento}`;

        this.procedimentosTemp.push(registro); // adiciona no array temporário

        const novoHistorico = [...(this.procedimentosBanco ? [this.procedimentosBanco] : []), ...this.procedimentosTemp].join('\n\n');

        this.form.patchValue({
          procedimentos: novoHistorico,
          novoProcedimento: ''
        });

        this.updateProcedimentosCount();

        this.toastrService.info('Agora você precisa salvar as atualizações do chamado.', 'Procedimento incluído', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true,
        });
      } else {
        this.toastrService.warning('O procedimento deve conter pelo menos 10 caracteres.');
      }
    }
  });
}

// MÉTODO PARA REMOVER UM PROCEDIMENTO
removeLastProcedure(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { message: 'Deseja mesmo remover o último procedimento?' }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (this.procedimentosTemp.length > 0) {
        this.procedimentosTemp.pop(); // remove o último temporário
        const novoHistorico = [...(this.procedimentosBanco ? [this.procedimentosBanco] : []), ...this.procedimentosTemp].join('\n\n');
        this.form.patchValue({ procedimentos: novoHistorico });

        this.toastrService.info('Último procedimento removido.', 'Remoção', {
          timeOut: 3000,
          progressBar: true
        });
      } else {
        this.toastrService.warning('Não há procedimento para remover.');
      }
    }
  });
 }

  // CONTADOR DE CARACTERES DO NOVO PROCEDIMENTO
  updateProcedimentosCount(): void {
    const novoProcedimento = this.form.get('novoProcedimento')?.value || '';
    this.charCountText = novoProcedimento.length;
  }

  // CONTADOR DAS OBSERVAÇÕES
updateObservacoesCount(): void {
  const observacoes = this.form.get('observacoes')?.value || '';
  this.observacoesCount = observacoes.length;
}
// MÉTO PARA RECUPERAR OS PROCEDIMENTOS ATUAIS
  private getProcedureCurrent(): string {
    const procedimentos = this.form.get('procedimentos')?.value?.trim();
    return procedimentos && procedimentos !== 'Nenhum procedimento registrado para esse chamado.'
      ? procedimentos
      : '';
  }

// MÉTODO PARA OBTER A DATA E HORA ATUAL FORMATADAS
  private getDataHoraAtual(): string {
    return new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

// MÉTODO PARA ATUALIZAR UM CHAMADO
update(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { message: 'Deseja mesmo atualizar o chamado?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const chamadoAtualizado = { ...this.chamado, ...this.form.value };

      this.chamadoService.update(chamadoAtualizado).subscribe({
        next: () => {
          this.toastrService.success('Chamado atualizado com sucesso!', 'Atualização');
          this.router.navigate(['chamados']);
        },
        error: (ex) => {
          if (ex.error?.errors) {
            // Caso existam múltiplos erros de validação
            ex.error.errors.forEach((err: { message: string }) => {
              this.toastrService.error(err.message, 'Erro de Validação');
            });
          } else {
            // Caso seja um erro genérico
            const errorMsg = ex.error?.message || ex.error?.error || 'Erro ao atualizar chamado';
            this.toastrService.error(errorMsg, 'Erro');
          }
        }
      });
    }
  });
}

// MÉTODO PARA CANCELAR AS AÇÕES
  cancelActions(): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { message: 'Tem certeza de que deseja cancelar a edição?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['chamados']);
        }
      });
    }

// MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validFiel(): boolean {
    return this.form.valid;
  }
}
