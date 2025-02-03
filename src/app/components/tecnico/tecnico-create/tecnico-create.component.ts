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


  // INSTANCIANDO UM TÉCNICO
  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    celular:'',
    senha:'',
    perfis: [],
    dataCriacao: ''

  }

   // GRUPO DE FORMULÁRIOS REATIVOS
    form: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.minLength(10),]),
    cpf: new FormControl(null, [Validators.required, Validators.minLength(11)]),
    celular: new FormControl(null, [Validators.minLength(11)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    senha: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });
  constructor(
    private service:TecnicoService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {}

   // MÉTODO PARA ADICIONAR O PERFIL DO TÉCNICO
   addPerfil(perfil: any): void {
    if (!this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.push(perfil);
    }
  }

// MÉTODO PARA CRIAR UM TÉCNICO
create(): void {
  this.service.create(this.tecnico).subscribe({
    next: () => {
      this.toast.success('Técnico cadastrado com sucesso', 'Cadastro');
      this.router.navigate(['tecnicos'])
    },
    error: (ex) => {
      if (ex.error && ex.error.errors) {

        ex.error.errors.forEach((error: any) => {
          this.toast.error(`${error.fieldName}: ${error.message}`, "Cadastro");
        });
      } else if (ex.error && ex.error.message) {
        this.toast.error(ex.error.message, "Cadastro");
      } else {
        this.toast.error('Ocorreu um erro inesperado.', "Cadastro");
      }
    }
  });
}

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
