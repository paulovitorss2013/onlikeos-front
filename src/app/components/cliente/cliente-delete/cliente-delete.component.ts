import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.form.get('isAdmin')?.disable();
    this.form.get('nome')?.disable();
    this.form.get('cpf')?.disable();
    this.form.get('email')?.disable();
    this.form.get('celular')?.disable();
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
        this.toast.error('Erro ao carregar os dados do cliente.');
      }
    });
  }

  // MÉTÓDO PARA DELETAR UM TÉCNICO
  delete(): void {
    this.service.delete(this.cliente.id).pipe(
      tap(() => {
        this.toast.success('Cliente deletado com sucesso!', 'Delete');
        this.router.navigate(['clientes']);
      }),
      catchError((error) => {
        if (error?.error?.errors) {
          error.error.errors.forEach((element: { message: string }) =>
            this.toast.error(element.message)
          );
        } else if (error?.error?.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error('Erro desconhecido ao deletar o cliente.');
        }
        return of(null); 
      })
    ).subscribe();
  }
  
  
  // MÉTÓDO CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Sair sem deletar o cliente?')) {
      this.router.navigate(['clientes']);
    }
  }
}