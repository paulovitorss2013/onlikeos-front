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
 
  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(18)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
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
    this.toastr.warning('Cadastrar um técnico requer privilégios de administrador.', 'Atenção!');
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
      this.toastr.success('Técnico cadastrado com sucesso!', 'Cadastro');
      this.router.navigate(['tecnicos']);
    },
    error: (ex) => {
      if (ex.status === 403) return;
      if (ex.error.errors) {
        ex.error.errors.forEach((element: { message: string }) =>
          this.toastr.error(element.message)
        );
      } else {
        this.toastr.error(ex.error.message || 'Erro desconhecido ao criar técnico.');
      }
    }
  });
}

// AVISO REQUISITOS DA SENHA
showPasswordWarning(): void {
  this.toastr.warning(
    'A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo.',
    'Atenção!'
  );
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
