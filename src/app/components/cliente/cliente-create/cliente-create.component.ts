import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

 // INSTÂNCIA DO CLIENTE
 cliente: Cliente = {
  id: '',
  nome: '',
  cpf: '',
  email: '',
  senha: 'erNB1PZ@q*Wv76Fdr0TM',
  celular: '',
  dataCriacao:''
 }

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(10)]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)]),
    celular: new FormControl('', [Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.minLength(8)])
  });

  // CONSTRUTOR
  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

 // MÉTODO PARA CRIAR UM CLIENTE
create(): void {
  if (!this.validaCampos()) return
  const cliente: Cliente = { ...this.form.value }
  this.service.create(cliente).subscribe({
    next: () => {
      this.toast.success('Cliente cadastrado com sucesso!', 'Cadastro')
      this.router.navigate(['clientes'])
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

  // MÉTODO PARA CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {
      this.router.navigate(['clientes']);
    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
