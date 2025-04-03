import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    cpfCnpj: '',
    email: '',
    senha: '',
    celular: '',
    telefone: '',
    perfis: [],
    dataCriacao: ''
  };

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpfCnpj: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    telefone: new FormControl('', [Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
    perfis: new FormControl([]),
    isAdmin: new FormControl({ value: false, disabled: true }),
    privilegios: new FormControl({ value: '', disabled: true })
  });

  // CONSTRUTOR
  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.toastr.warning('Deletar um(a) técnico(a) requer privilégios de administrador(a).', 'Atenção!');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tecnico.id = id;
      this.findById();
    } else {
      this.toastr.error('ID do(a) técnico(a) não encontrado.');
      this.router.navigate(['tecnicos']);
    }
  }

  // MÉTODO PARA BUSCAR O TÉCNICO E SEUS ATRIBUTOS POR ID
  findById(): void {
    this.service.findById(this.tecnico.id).subscribe({
      next: (resposta) => {
        this.tecnico = resposta;
        const isAdmin = resposta.perfis.includes('ADMIN');
        this.form.patchValue({
          nome: resposta.nome,
          cpfCnpj: resposta.cpfCnpj,
          celular: resposta.celular,
          telefone: resposta.telefone,
          email: resposta.email,
          senha: resposta.senha,
          perfis: resposta.perfis || [],
          isAdmin: isAdmin,
        });
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar os dados do(a) técnico(a).');
      }
    });
  }

  // MÉTÓDO PARA DELETAR UM TÉCNICO
  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja deletar este(a) técnico(a)?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(this.tecnico.id).pipe(
          tap(() => {
            this.toastr.success('Técnico(a) deletado(a) com sucesso!', 'Delete');
            this.router.navigate(['tecnicos']);
          }),
          catchError((error) => {
            if (error?.error?.errors) {
              error.error.errors.forEach((element: { message: string }) =>
                this.toastr.error(element.message)
              );
            } else if (error?.error?.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('Erro desconhecido ao deletar o(a) técnico(a).');
            }
            return of(null);
          })
        ).subscribe();
      }
    });
  }
  

  /// MÉTODO CANCELAR AS AÇÕES
  cancelActions(): void {
    this.router.navigate(['tecnicos']);
  }
  
}

