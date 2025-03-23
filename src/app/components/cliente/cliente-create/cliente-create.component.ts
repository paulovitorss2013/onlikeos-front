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
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    login: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl(''),
    cep: new FormControl('', [Validators.minLength(8)]),
    logradouro: new FormControl(''),
    numero: new FormControl(''),
    bairro: new FormControl(''),
    municipio: new FormControl(''),
    uf: new FormControl(''),
    coordenada: new FormControl(''),
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
    if (!this.validaCampos()) return;
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

  // MÉTODO PARA CANCELAR AS AÇÕES
  cancelar(): void {
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
  validaCampos(): boolean {
    return this.form.valid;
  }
}
