import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {
  
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
    isAdmin: new FormControl(false),
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

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.toastr.warning('Atualizar um técnico requer privilégios de administrador.', 'Atenção!');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tecnico.id = id;
      this.findById();
    } else {
      this.toastr.error('ID do técnico não encontrado');
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
        this.toastr.error('Erro ao carregar os dados do técnico');
      }
    });
  }

  // MÉTODO PARA ATUALIZAR O PERFIL DO TÉCNICO
  addPerfil(perfil: string): void {
    const perfis = this.form.get('perfis')?.value as string[];
    if (perfil === 'ADMIN') {
      if (!perfis.includes('ADMIN')) {
        perfis.push('ADMIN');
      }
    } else {
      if (perfis.includes(perfil)) {
        this.form.get('perfis')?.setValue(perfis.filter(p => p !== perfil));
      } else {
        this.form.get('perfis')?.setValue([...perfis, perfil]);
      }
    }
    const validPerfis = this.form.get('perfis')?.value.filter((perfil: string) => perfil);
    this.form.get('perfis')?.setValue(validPerfis);
    console.log('Perfis selecionados:', this.form.get('perfis')?.value);
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
  
    const tecnico: Tecnico = {
      id: this.tecnico.id,
      nome: this.form.value.nome,
      cpfCnpj: this.form.value.cpfCnpj,
      email: this.form.value.email,
      celular: this.form.value.celular,
      telefone: this.form.value.telefone,
      senha: this.form.value.senha,
      perfis: perfisConvertidos.map(p => p.toString()),
      dataCriacao: this.tecnico.dataCriacao
    };
  
    this.service.update(tecnico).subscribe({
      next: () => {
        this.toastr.success('Técnico atualizado com sucesso!', 'Atualização');
        this.router.navigate(['tecnicos']);
      },
      error: (ex) => {
        if (ex.status === 403) return;
        if (ex.error?.errors) {
          ex.error.errors.forEach((element: { message: string }) =>
            this.toastr.error(element.message)
          );
        } else {
          this.toastr.error(ex.error.message || 'Erro desconhecido ao atualizar o técnico.');
        }
      }
    });
  }
  
// MÉTODO PARA CANCELAR AS AÇÕES
  cancelar(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja cancelar a edição?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['tecnicos']);
      }
    });
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}