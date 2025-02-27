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
    cpf: '',
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

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    logradouro: new FormControl('', [Validators.required, Validators.minLength(8)]),
    numero: new FormControl('', [Validators.required, Validators.minLength(8)]),
    bairro: new FormControl('', [Validators.required, Validators.minLength(8)]),
    municipio: new FormControl('', [Validators.required, Validators.minLength(8)]),
    uf: new FormControl('', [Validators.required, Validators.minLength(8)]),
    coordenada: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  
  // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cliente.id = id;
      this.findById();
    } else {
      this.toast.error('ID do cliente não encontrado');
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
          cpf: resposta.cpf,
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
        this.toast.error('Erro ao carregar os dados do cliente');
      }
    });
  }
  
  // MÉTÓDO PARA ATUALIZAR UM TÉCNICO
  update(): void {
    if (!this.validaCampos()) return;  
    
    const cliente: Cliente = {
      id: this.cliente.id,
      nome: this.form.value.nome,
      cpf: this.form.value.cpf,
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
        this.toast.success('Cliente atualizado com sucesso', 'Atualização');
        this.router.navigate(['clientes']);
      },
      error: (ex) => {
        if (ex.error?.errors) {
          ex.error.errors.forEach((element: { message: string }) =>
            this.toast.error(element.message)
          );
        } else if (ex.error?.message) {
          this.toast.error(ex.error.message);
        } else {
          this.toast.error('Erro desconhecido ao atualizar o cliente.');
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