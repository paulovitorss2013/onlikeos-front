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
    dataCriacao: ''
  };

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    privilegios: new FormControl({ value: '', disabled: true })
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
      console.log('ID capturado da URL:', this.cliente.id);
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
        console.log('Dados recebidos:', this.cliente);
        this.form.patchValue({
          nome: resposta.nome,
          cpf: resposta.cpf,
          celular: resposta.celular,
          email: resposta.email,
          senha: resposta.senha,
        });
        console.log('Perfis recebidos:', this.form.get('perfis')?.value);
      },
      error: (err) => {
        console.log('Erro ao buscar cliente:', err);
        this.toast.error('Erro ao carregar os dados do cliente');
      }
    });
  }
  
  // MÉTÓDO PARA ATUALIZAR UM TÉCNICO
  update(): void {
    if (!this.validaCampos()) return;
  
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
  
    const cliente: Cliente = {
      id: this.cliente.id,
      nome: this.form.value.nome,
      cpf: this.form.value.cpf,
      email: this.form.value.email,
      celular: this.form.value.celular,
      senha: this.form.value.senha,
      dataCriacao: this.cliente.dataCriacao 
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