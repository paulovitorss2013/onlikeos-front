import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {
  
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
  }

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
          privilegios: isAdmin ? 'Administrador' : ''
        });
        console.log('Perfis recebidos:', this.form.get('perfis')?.value);
      },
      error: (err) => {
        console.log('Erro ao buscar técnico:', err);
        this.toast.error('Erro ao carregar os dados do técnico');
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
  
    // Filtra apenas valores numéricos válidos e descarta valores inválidos
    let perfisConvertidos: number[] = perfis
      .map(perfil => Number(perfil))
      .filter(perfil => !isNaN(perfil));
  
    // Adiciona ou remove o ADMIN conforme o checkbox
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
      cpf: this.form.value.cpf,
      email: this.form.value.email,
      celular: this.form.value.celular,
      senha: this.form.value.senha,
      perfis: perfisConvertidos.map(p => p.toString()),
      dataCriacao: this.tecnico.dataCriacao 
    };  
    this.service.update(tecnico).subscribe({
      next: () => {
        this.toast.success('Técnico atualizado com sucesso', 'Atualização');
        this.router.navigate(['tecnicos']);
      },
      error: (ex) => {
        if (ex.error?.errors) {
          ex.error.errors.forEach((element: { message: string }) =>
            this.toast.error(element.message)
          );
        } else if (ex.error?.message) {
          this.toast.error(ex.error.message);
        } else {
          this.toast.error('Erro desconhecido ao atualizar técnico.');
        }
      }
    });
  }
  
  // MÉTÓDO CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {
      this.router.navigate(['tecnicos']);
    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}