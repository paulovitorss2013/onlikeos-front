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
  
  // INSTÂNCIA DO CLIENTE
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

  // GRUPO DE FORMULÁRIOS REATIVOS COM CAMPOS DESABILITADOS
  form: FormGroup = new FormGroup({
    nome: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(11)]),
    celular: new FormControl({ value: '', disabled: true }, [Validators.minLength(11)]),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
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

  // MÉTODO PARA BUSCAR O CLIENTE E SEUS ATRIBUTOS POR ID
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
      error: () => {
        this.toastr.error('Erro ao carregar os dados do cliente.');
      }
    });
  }

  // MÉTODO PARA DELETAR O CLIENTE
  delete(): void {
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
  
  // MÉTODO PARA CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Sair sem deletar o cliente?')) {
      this.router.navigate(['clientes']);
    }
  }
}
