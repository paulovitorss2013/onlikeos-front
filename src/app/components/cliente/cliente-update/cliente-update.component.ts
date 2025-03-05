import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {
  
  // INSTÂNCIA DO TÉCNICO
  cliente: Cliente = {
    id: '',
    nome: '',
    cpfCnpj: '',
    email: '',
    senha: 'erNB1PZ@q*Wv76Fdr0TM',
    celular: '',
    dataCriacao: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    municipio: '',
    uf: '',
    coordenada: ''
  };

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

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl(''),
    cep: new FormControl('', [Validators.minLength(8)]),
    logradouro: new FormControl(''),
    numero: new FormControl(''),
    bairro: new FormControl(''),
    municipio: new FormControl(''),
    uf: new FormControl(''),
    coordenada: new FormControl('')
  });
  
  // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        });
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os dados do cliente');
      }
    });
  }
  
  // MÉTÓDO PARA ATUALIZAR UM TÉCNICO
  update(): void {
    if (!this.validaCampos()) return;  
    
    const cliente: Cliente = {
      id: this.cliente.id,
      nome: this.form.value.nome,
      cpfCnpj: this.form.value.cpfCnpj,
      email: this.form.value.email,
      celular: this.form.value.celular,
      senha: this.form.value.senha,
      dataCriacao: this.cliente.dataCriacao,
      cep: this.form.value.cep,
      logradouro: this.form.value.logradouro,
      numero: this.form.value.numero,
      bairro: this.form.value.bairro,
      municipio: this.form.value.municipio,
      uf: this.form.value.uf,
      coordenada: this.form.value.coordenada,
    };
    this.service.update(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente atualizado com sucesso!', 'Atualização');
        this.router.navigate(['clientes']);
      },
      error: (ex) => {
        if (ex.error?.errors) {
          ex.error.errors.forEach((element: { message: string }) =>
            this.toastr.error(element.message)
          );
        } else if (ex.error?.message) {
          this.toastr.error(ex.error.message);
        } else {
          this.toastr.error('Erro desconhecido ao atualizar o cliente.');
        }
      }
    });
  }
  
  // MÉTÓDO CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Sair sem salvar as alterações?')) {
      this.router.navigate(['clientes']);
    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}