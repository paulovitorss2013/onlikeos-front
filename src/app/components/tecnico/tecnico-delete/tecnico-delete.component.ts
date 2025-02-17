import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrl: './tecnico-delete.component.css'
})
export class TecnicoDeleteComponent implements OnInit {
  
  // INSTÂNCIA DO TÉCNICO
  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    celular: '',
    perfis: [],
    dataCriacao: ''
  };

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    perfis: new FormControl([]),
    isAdmin: new FormControl(false),
    privilegios: new FormControl({ value: '', disabled: true })
  });
  
  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tecnico.id = id;
      console.log('ID capturado da URL:', this.tecnico.id);
      this.findById();
    } else {
      this.toast.error('ID do técnico não encontrado');
      this.router.navigate(['tecnicos']);
    }
    this.form.get('isAdmin')?.disable();
    this.form.get('nome')?.disable();
    this.form.get('cpf')?.disable();
    this.form.get('email')?.disable();
    this.form.get('celular')?.disable();
  }

  // MÉTODO PARA BUSCAR O TÉCNICO E SEUS ATRIBUTOS POR ID
  findById(): void {
    this.service.findById(this.tecnico.id).subscribe({
      next: (resposta) => {
        this.tecnico = resposta;
        console.log('Dados recebidos:', this.tecnico);
        const isAdmin = resposta.perfis.includes('ADMIN');
        this.form.patchValue({
          nome: resposta.nome,
          cpf: resposta.cpf,
          celular: resposta.celular,
          email: resposta.email,
          senha: resposta.senha,
          perfis: resposta.perfis || [],
          isAdmin: isAdmin,
        });
        console.log('Perfis recebidos:', this.form.get('perfis')?.value);
      },
      error: (err) => {
        console.log('Erro ao buscar técnico:', err);
        this.toast.error('Erro ao carregar os dados do técnico');
      }
    });
  }

  // MÉTÓDO PARA DELETAR UM TÉCNICO
  delete(): void {
    this.service.delete(this.tecnico.id).pipe(
      tap(() => {
        this.toast.success('Técnico deletado com sucesso', 'Delete');
        this.router.navigate(['tecnicos']);
      }),
      catchError((error) => {
        if (error?.error?.errors) {
          error.error.errors.forEach((element: { message: string }) =>
            this.toast.error(element.message)
          );
        } else if (error?.error?.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error('Erro desconhecido ao deletar o técnico.');
        }
        return of(null); 
      })
    ).subscribe();
  }
  
  
  // MÉTÓDO CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Sair sem deletar o técnico?')) {
      this.router.navigate(['tecnicos']);
    }
  }
}