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

 // INSTANCIANDO UM TÉCNICO
  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    celular:'',
    senha:'',
    perfis: [],
  }

   // GRUPO DE FORMULÁRIOS REATIVOS
   form: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl(null, [Validators.required, Validators.minLength(11)]),
    celular: new FormControl(null, [Validators.minLength(11)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    senha: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    perfis: new FormControl([])
  });
  constructor(
    private service:TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

   // MÉTODO PARA ADICIONAR O PERFIL DO TÉCNICO
   addPerfil(perfil: any): void {
    if (!this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.push(perfil);
    }
  }
// MÉTODO PARA ATUALIZAR UM TÉCNICO
findById():void {
  this.service.findById(this.tecnico.id).subscribe(resposta => {
    resposta.perfis = 
    this.tecnico =  resposta;
    })
  }

// MÉTODO PARA CRIAR UM TÉCNICO
update(): void {
  this.service.create(this.tecnico).subscribe({
    next: () => {
      this.toast.success('Técnico atualizado com sucesso', 'Atualização');
      this.router.navigate(['tecnicos'])
    },
    error: (ex) => {
      if (ex.error && ex.error.errors) {

        ex.error.errors.forEach((error: any) => {
          this.toast.error(`${error.fieldName}: ${error.message}`, "Atualização");
        });
      } else if (ex.error && ex.error.message) {
        this.toast.error(ex.error.message, "Atualização");
      } else {
        this.toast.error('Ocorreu um erro inesperado.', "Atualização");
      }
    }
  });
}

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
