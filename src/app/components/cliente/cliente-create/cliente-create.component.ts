import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {
  
  // VARIÁVEIS DE CONTROLE VERIFICAÇÃO DE LOGIN
  loginDisponivel: boolean | null = null;
  erroVerificacaoLogin: boolean = false;
  loginMessage: string = '';
  
  // VARIÁVEL DE CONTROLE MENSAGEM DE CPF/CNPJ INVÁLIDO
  cpfCnpjInvalido: boolean = false;

  // INSTÂNCIA DO CLIENTE
  cliente: Cliente = {
    id: '',
    nome: '',
    login: '',
    cpfCnpj: '',
    email: '',
    senha: 'erNB1PZ@q*Wv76Fdr0TM',
    celular: '',
    telefone: '',
    dataCriacao: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    coordenada: ''
  };
  
  // INICIALIZAÇÃO MÁSCARAS PARA CPF E CNPJ
  cpfCnpjMask: string = '000.000.000-00'; // INICIALMENTE, CPF
  tipoCliente: string = 'Pessoa Física'; // INICIA COMO PESSOA FÍSICA

  // LISTA DE ESTADOS BRASILEIROS
  estadosBrasileiros = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(60)]),
    login: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(18)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl(''),
    cep: new FormControl('', [Validators.minLength(8)]),
    logradouro: new FormControl('', Validators.maxLength(100)),
    numero: new FormControl('', Validators.maxLength(100)),
    complemento: new FormControl('', Validators.maxLength(100)),
    bairro: new FormControl('', Validators.maxLength(100)),
    municipio: new FormControl('', Validators.maxLength(100)),
    uf: new FormControl('', Validators.maxLength(2)),
    coordenada: new FormControl('', Validators.maxLength(100)),
    tipoCliente: new FormControl('Pessoa Física', [Validators.required])
  });

  // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.onTipoClienteChange(); // APLICA A MÁSCARA CORRETA NO INÍCIO
  }

  // MÉTODO PARA ALTERAR A MÁSCARA DE CPF/CNPJ COM BASE NA SELEÇÃO DO TIPO DE CLIENTE
  onTipoClienteChange(): void {
    const tipo = this.form.get('tipoCliente')?.value;
    if (tipo === 'Pessoa Física') {
      this.cpfCnpjMask = '000.000.000-00'; // MÁSCARA PARA CPF
    } else if (tipo === 'Pessoa Jurídica') {
      this.cpfCnpjMask = '00.000.000/0000-00'; // MÁSCARA PARA CNPJ
      this.form.get('cpfCnpj')?.setValue(''); // LIMPA O CAMPO DE CPF/CNPJ
    }
  }

  // MÉTODO PARA CRIAR UM CLIENTE
  create(): void {
    if (!this.validField()) return;
    const cliente: Cliente = { ...this.form.value };
    this.service.create(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente cadastrado com sucesso!', 'Cadastro');
        this.router.navigate(['clientes']);
      },
      error: (ex) => {
        if (ex.error.errors)
          ex.error.errors.forEach((element: { message: string }) =>
            this.toastr.error(element.message)
          );
        else this.toastr.error(ex.error.message);
      }
    });
  }

  // MÉTODO PARA VERIFICAR SE O LOGIN JÁ EXISTE AO DESFOCAR
  verifyLogin(): void {
    const login = this.form.get('login')?.value;
  
    if (!login) {
      this.loginMessage = '';
      return;
    }
    this.service.verificarLogin(login).subscribe({
      next: (exists: boolean) => {
        this.loginDisponivel = !exists;
        this.loginMessage = exists ? 'Login já em uso.' : 'Login disponível!';
      },
      error: () => {
        this.loginDisponivel = false;
        this.loginMessage = 'Erro ao verificar o login.';
      }
    });
  }



  // MÉTODO PARA CHAMAR AS VALIDAÇÕES DE CPF E CNPJ
  validCpfCnpj(): void {
    const control = this.form.get('cpfCnpj');
    const cpfCnpjValue = control?.value;
  
    this.cpfCnpjInvalido = false;
  
    if (!cpfCnpjValue) return;
  
    const cleanedValue = cpfCnpjValue.replace(/\D/g, '');
  
    const isValid = this.isValidCpf(cleanedValue) || this.isValidCnpj(cleanedValue);
  
    if (!isValid) {
      this.cpfCnpjInvalido = true;
      control?.setErrors({ cpfCnpjInvalido: true });
    } else {
      this.cpfCnpjInvalido = false;
      if (control?.hasError('cpfCnpjInvalido')) {
        control.setErrors(null);
      }
    }
  }


  // VALIDAÇÃO DO CPF/CNPJ
isValidCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0, remainder;
    for (let i = 0; i < 9; i++) sum += +cpf[i] * (10 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== +cpf[9]) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += +cpf[i] * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === +cpf[10];
  }

  // VALIDAÇÃO DO CNPJ
  isValidCnpj(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0, remainder;
    for (let i = 0; i < 12; i++) sum += +cnpj[i] * weights1[i];
    remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== +cnpj[12]) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) sum += +cnpj[i] * weights2[i];
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    return digit2 === +cnpj[13];
  }

  // MÉTODO PARA CANCELAR AS AÇÕES
  cancelActions(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja cancelar a criação?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['clientes']);
      }
    });
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validField(): boolean {
    return this.form.valid;
  }
}
