import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrl: './tecnico-update.component.css'
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
    perfis: new FormControl([])
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
        
        this.form.patchValue({
          nome: resposta.nome,
          cpf: resposta.cpf,
          celular: resposta.celular,
          email: resposta.email,
          senha: resposta.senha,
          perfis: resposta.perfis || []
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
  addPerfil(perfil: number): void {
    const perfis = this.form.get('perfis')?.value as number[];
  
    // Se o perfil "Administrador" (perfil 2) for adicionado, garante que o "Técnico" (perfil 0) está presente
    if (perfil === 2) {
      // Se o perfil técnico (0) não estiver na lista, adicione-o
      if (!perfis.includes(0)) {
        this.form.get('perfis')?.setValue([0, ...perfis]);
      }
    } else {
      // Se for outro perfil, apenas adicione-o ou remova-o
      if (perfis.includes(perfil)) {
        this.form.get('perfis')?.setValue(perfis.filter(p => p !== perfil));
      } else {
        this.form.get('perfis')?.setValue([...perfis, perfil]);
      }
    }
  
    // Remover qualquer valor NaN da lista de perfis
    const validPerfis = this.form.get('perfis')?.value.filter((perfil: number) => !isNaN(perfil));
  
    // Atualiza a lista de perfis com valores válidos
    this.form.get('perfis')?.setValue(validPerfis);
  
    console.log('Perfis selecionados:', this.form.get('perfis')?.value);
  }
  
  // MÉTÓDO PARA ATUALIZAR UM TÉCNICO
  update(): void {
    if (!this.validaCampos()) return;
  
    // Filtra os perfis para garantir que apenas números válidos sejam enviados
    const perfisAtualizados = this.form.value.perfis.filter((perfil: number) => !isNaN(perfil));
  
    const tecnicoAtualizado: Tecnico = {
      ...this.tecnico,
      ...this.form.value,
      perfis: perfisAtualizados
    };
  
    console.log('Enviando técnico atualizado:', tecnicoAtualizado);
  
    this.service.update(tecnicoAtualizado).subscribe({
      next: () => {
        this.toast.success('Técnico atualizado com sucesso', 'Atualização');
        this.router.navigate(['tecnicos']);
      },
      error: (ex) => {
        console.log('Erro completo:', ex);
        if (ex.error.errors)
          ex.error.errors.forEach((element: { message: string }) =>
            this.toast.error(element.message)
          );
        else this.toast.error(ex.error.message);
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
