import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {

 // INSTÂNCIA DO TÉCNICO
 tecnico: Tecnico = {
  id: '',
  nome: '',
  cpfCnpj: '',
  email: '',
  senha: '',
  celular: '',
  telefone: '',
  perfis: [],
  dataCriacao:''
 }

  // VARIÁVEIS DE CONTROLE DAS MENSAGENS
  cpfMessage: string = '';
  emailMessage: string = '';
  passwordMessage: string = '';

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(18)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    perfis: new FormControl([])
  });

  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.toastr.warning('Cadastrar técnicos(as) requer privilégios de administrador(a).', 'Atenção!');
  }

  // MÉTODO PARA ADICIONAR O PERFIL DO TÉCNICO
  addPerfil(perfil: number): void {
    const perfis = this.form.get('perfis')?.value as number[];
    if (perfis.includes(perfil)) {
      this.form.get('perfis')?.setValue(perfis.filter(p => p !== perfil));
    } else {
      this.form.get('perfis')?.setValue([...perfis, perfil]);
    }
  }

 // MÉTODO PARA CRIAR UM TÉCNICO
 create(): void {
  if (!this.validField()) return;
  const tecnico: Tecnico = { ...this.form.value };
  this.service.create(tecnico).subscribe({
    next: () => {
      this.toastr.success('Técnico(a) cadastrado(a) com sucesso!', 'Cadastro');
      this.router.navigate(['tecnicos']);
    },
    error: (ex) => {
      if (ex.status === 403) return;
      if (ex.error.errors) {
        ex.error.errors.forEach((element: { message: string }) =>
          this.toastr.error(element.message)
        );
      } else {
        this.toastr.error(ex.error.message || 'Erro desconhecido ao criar o(a) técnico(a).');
      }
    }
  });
}

// MENSAGEM REQUISITOS DA SENHA
showPasswordWarning(): void {
  this.passwordMessage = 'A senha deve conter no mínimo 8 caracteres, incluindo uma letra minúscula, uma maiúscula, um número e um símbolo. Não deve conter: ´ ~ ç [ )';
}

// MÉTODO PARA VERIFICAR CPF DUPLICADO AO DESFOCAR
checkCpf(): void {
  const cpf = this.form.get('cpfCnpj')?.value;

  if (!this.isValidCpf(cpf)) {
    this.cpfMessage = 'CPF inválido!';
    return;
  }

  this.service.existsByCpfCnpjCreate(cpf).subscribe((exists) => {
    this.cpfMessage = exists ? 'CPF já cadastrado para um técnico!' : 'CPF disponível!';
  });
}

// MÉTODO PARA VERIFICAR SE O CPF É VÁLIDO
isValidCpf(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf[i - 1]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf[i - 1]) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[10])) return false;

  return true;
};

// MÉTODO PARA CHECAR SE O E-MAIL ESTÁ DISPONÍVEL
checkEmail(): void {
  const email = this.form.get('email')?.value;

  if (!this.isValidEmail(email)) {
    this.emailMessage = 'E-mail inválido!';
    return;
  }

  this.service.existsByEmailCreate(email).subscribe((exists) => {
    this.emailMessage = exists ? 'E-mail já em uso!' : 'E-mail disponível!';
  });
}

// MÉTODO PARA VALIDAR O E-MAIL
isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// MÉTODO PARA CANCELAR AS AÇÕES
  cancelActions(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja cancelar a criação?' }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['tecnicos']);
        }
      });
    }

// MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
validField(): boolean {
  return this.form.valid;
 }
}
