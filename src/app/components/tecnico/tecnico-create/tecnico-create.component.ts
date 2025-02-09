import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {

  // Grupo de formulários reativos
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
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Método para adicionar o perfil do técnico
  addPerfil(perfil: number): void {
    const perfis = this.form.get('perfis')?.value as number[];
    if (perfis.includes(perfil)) {
      this.form.get('perfis')?.setValue(perfis.filter(p => p !== perfil));
    } else {
      this.form.get('perfis')?.setValue([...perfis, perfil]);
    }
    console.log('Perfis selecionados:', this.form.get('perfis')?.value);
  }

 // MÉTODO PARA CRIAR UM TÉCNICO
create(): void {
  if (!this.validaCampos()) return

  // Atualiza o objeto técnico com os valores do formulário
  const tecnico: Tecnico = { ...this.form.value }

  this.service.create(tecnico).subscribe({
    next: () => {
      this.toast.success('Técnico cadastrado com sucesso', 'Cadastro')
      this.router.navigate(['tecnicos'])
    },
    error: (ex) => {
      if (ex.error.errors)
        ex.error.errors.forEach((element: { message: string }) =>
          this.toast.error(element.message)
        )
      else this.toast.error(ex.error.message)
    }
  })
}



  // Método para confirmar o cancelamento
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {
      this.router.navigate(['tecnicos']);
    }
  }

  // Método para validar os campos do formulário
  validaCampos(): boolean {
    return this.form.valid;
  }
}
