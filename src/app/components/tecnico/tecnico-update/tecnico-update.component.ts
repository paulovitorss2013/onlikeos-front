import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {
  
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
    dataCriacao: ''
  };
  
  // VARIÁVEL DE CONTROLE CAMPO NOVA SENHA
  mostrarNovaSenha = false;

  // VARIÁVEIS DE CONTROLE DAS MENSAGENS
  cpfMessage: string = '';
  emailMessage: string = '';
  passwordMessage: string = '';

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    novaSenha: new FormControl(''),
    perfis: new FormControl([]),
    isAdmin: new FormControl(false),
    privilegios: new FormControl({ value: '', disabled: true })
  });
  
  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.toastr.warning('Atualizar um(a) técnico(a) requer privilégios de administrador(a).', 'Atenção!');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tecnico.id = id;
      this.findById();
    } else {
      this.toastr.error('ID do(a) técnico(a) não encontrado!');
      this.router.navigate(['tecnicos']);
    }
  }

  // MÉTODO PARA BUSCAR O TÉCNICO E SEUS ATRIBUTOS POR ID
  findById(): void {
    this.service.findById(this.tecnico.id).subscribe({
      next: (resposta) => {
        this.tecnico = resposta;
        const isAdmin = resposta.perfis.includes('ADMIN');
        this.form.patchValue({
          nome: resposta.nome,
          cpfCnpj: resposta.cpfCnpj,
          celular: resposta.celular,
          telefone: resposta.telefone,
          email: resposta.email,
          perfis: resposta.perfis || [],
          isAdmin: isAdmin,
        });
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os dados do(a) técnico(a)!');
      }
    });
  }

  // MÉTODO PARA ATUALIZAR O PERFIL DO TÉCNICO
  addPerfil(perfil: string): void {
    const perfis = this.form.get('perfis')?.value as string[];
    if (perfil === 'ADMIN') {
      if (!perfis.includes('ADMIN')) {
        perfis.push('ADMIN');
      }
    } else {
      if (perfis.includes(perfil)) {
        this.form.get('perfis')?.setValue(perfis.filter(p => p !== perfil));
      } else {
        this.form.get('perfis')?.setValue([...perfis, perfil]);
      }
    }
    const validPerfis = this.form.get('perfis')?.value.filter((perfil: string) => perfil);
    this.form.get('perfis')?.setValue(validPerfis);
    console.log('Perfis selecionados:', this.form.get('perfis')?.value);
  }
  
  // MÉTÓDO PARA ATUALIZAR UM TÉCNICO
  update(): void {
    if (!this.validField()) return;
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Deseja mesmo atualizar o(a) técnico(a)?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let perfis: string[] = this.form.value.perfis || [];
        let perfisConvertidos: number[] = perfis
          .map(perfil => Number(perfil))
          .filter(perfil => !isNaN(perfil));
  
        if (this.form.value.isAdmin) {
          if (!perfisConvertidos.includes(0)) {
            perfisConvertidos.push(0);
          }
        } else {
          perfisConvertidos = perfisConvertidos.filter(p => p !== 0);
        }
  
        const tecnico: Tecnico = {
          id: this.tecnico.id,
          nome: this.form.value.nome,
          cpfCnpj: this.form.value.cpfCnpj,
          email: this.form.value.email,
          celular: this.form.value.celular,
          telefone: this.form.value.telefone,
          perfis: perfisConvertidos.map(p => p.toString()),
          dataCriacao: this.tecnico.dataCriacao
        };
  
        if (this.form.value.novaSenha) {
          tecnico.senha = this.form.value.novaSenha;
        }
  
        this.service.update(tecnico).subscribe({
          next: () => {
            this.toastr.success('Técnico(a) atualizado(a) com sucesso!', 'Atualização');
            this.router.navigate(['tecnicos']);
          },
          error: (ex) => {
            if (ex.status === 403) return;
            if (ex.error?.errors) {
              ex.error.errors.forEach((element: { message: string }) =>
                this.toastr.error(element.message)
              );
            } else {
              this.toastr.error(ex.error.message || 'Erro desconhecido ao atualizar o(a) técnico(a)!.');
            }
          }
        });
      }
    });
  }

  // MENSAGEM REQUISITOS DA SENHA
 showPasswordWarning(): void {
  this.passwordMessage = 
'Requisitos: no mínimo 8 caracteres, sem espaços, uma letra minúscula, uma maiúscula, um número e um símbolo. Caracteres Proibídos: ´ ~ ç [ )';
}

// MÉTODO PARA VERIFICAR CPF DUPLICADO AO DESFOCAR
checkCpf(): void {
  const cpf = this.form.get('cpfCnpj')?.value;

  if (!this.isValidCpf(cpf)) {
    this.cpfMessage = 'CPF inválido!';
    return;
  }

  if (cpf === this.tecnico.cpfCnpj) {
    this.cpfMessage = '';
    return;
  }
  this.service.existsByCpfCnpjUpdate(cpf, this.tecnico.id).subscribe((exists) => {
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
  if (email === this.tecnico.email) {
    this.emailMessage = '';
    return;
  }
  this.service.existsByEmailUpdate(email, this.tecnico.id).subscribe((exists) => {
    this.emailMessage = exists ? 'E-mail já em uso!' : 'E-mail disponível!';
  });
}

// MÉTODO PARA VALIDAR O E-MAIL
isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// MÉTODO PARA HABILITAR A NOVA SENHA
habilitarNovaSenha() {
 this.mostrarNovaSenha = true;
}
  
  // MÉTODO PARA CANCELAR AS AÇÕES
  cancelActions(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja cancelar a edição?' }
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