import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrl: './cliente-delete.component.css'
})
export class ClienteDeleteComponent implements OnInit {
  
  // INSTÂNCIA DO CLIENTE
  cliente: Cliente = {
    id: '',
    nome: '',
    cpfCnpj: '',
    email: '',
    senha: '',
    celular: '',
    dataCriacao: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    municipio: '',
    uf:'',
    coordenada: ''
  };

  // INICIALIZAÇÃO MÁSCARAS PARA CPF E CNPJ
  cpfCnpjMask: string = '000.000.000-00'; // INICIALMENTE, CPF
  tipoCliente: string = 'Pessoa Física'; // INICIA COMO PESSOA FÍSICA

  // LISTA DE ESTADOS BRASILEIROS
  estadosBrasileiros = [
    { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
  ];
  

  // GRUPO DE FORMULÁRIOS REATIVOS COM CAMPOS DESABILITADOS
  form: FormGroup = new FormGroup({
    nome: new FormControl({ value: '', disabled: true }),
    cpfCnpj: new FormControl({ value: '', disabled: true }),
    celular: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    senha: new FormControl({ value: '', disabled: true }),
    cep: new FormControl({ value: '', disabled: true }),
    logradouro: new FormControl({ value: '', disabled: true }),
    numero: new FormControl({ value: '', disabled: true }),
    bairro: new FormControl({ value: '', disabled: true }),
    municipio: new FormControl({ value: '', disabled: true }),
    uf: new FormControl({ value: '', disabled: true }),
    coordenada: new FormControl({ value: '', disabled: true }),
    tipoCliente: new FormControl({ value: '', disabled: true })
});
  
  // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cliente.id = id;
      this.findById();
    } else {
      this.toastr.error('ID do cliente não encontrado');
      this.router.navigate(['clientes']);
    }
  }

  // MÉTODO PARA BUSCAR O TÉCNICO E SEUS ATRIBUTOS POR ID
  findById(): void {
    this.service.findById(this.cliente.id).subscribe({
      next: (resposta) => {
        this.cliente = resposta;
        
        if (resposta.cpfCnpj?.length === 11) {
          this.cpfCnpjMask = '000.000.000-00';
          this.tipoCliente = 'Pessoa Física';
        } else if (resposta.cpfCnpj?.length === 14) {
          this.cpfCnpjMask = '00.000.000/0000-00';
          this.tipoCliente = 'Pessoa Jurídica'; 
        }
        this.form.patchValue({
          nome: resposta.nome,
          cpfCnpj: resposta.cpfCnpj,
          celular: resposta.celular,
          email: resposta.email,
          senha: resposta.senha,
          cep: resposta.cep,
          logradouro: resposta.logradouro,
          numero: resposta.numero,
          bairro: resposta.bairro,
          municipio: resposta.municipio,
          uf: resposta.uf,
          coordenada: resposta.coordenada,
          tipoCliente: this.tipoCliente
        });
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os dados do cliente');
      }
    });
  }

  // MÉTODO PARA ALTERAR A MÁSCARA DE CPF/CNPJ COM BASE NA SELEÇÃO DO TIPO DE CLIENTE
  onTipoClienteChange(): void {
    const tipo = this.form.get('tipoCliente')?.value;
    if (tipo === 'Pessoa Física') {
      this.cpfCnpjMask = '000.000.000-00';
      this.form.get('cpfCnpj')?.setValue('');
    } else if (tipo === 'Pessoa Jurídica') {
      this.cpfCnpjMask = '00.000.000/0000-00';
      this.form.get('cpfCnpj')?.setValue('');
    }
  }

  // MÉTODO PARA DELETAR O CLIENTE
  delete(): void {
    const confirmar = window.confirm('Deseja mesmo deletar o cliente?');
    if (confirmar) {
      this.service.delete(this.cliente.id).pipe(
        tap(() => {
          this.toastr.success('Cliente deletado com sucesso!', 'Delete');
          this.router.navigate(['clientes']);
        }),
        catchError((error) => {
          if (error?.error?.errors) {
            error.error.errors.forEach((element: { message: string }) =>
              this.toastr.error(element.message)
            );
          } else if (error?.error?.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Erro desconhecido ao deletar o cliente.');
          }
          return of(null);
        })
      ).subscribe();
    }
  }
  
  // MÉTODO PARA CANCELAR AS AÇÕES
  cancelar(): void {
    this.router.navigate(['clientes']);
  }

}
