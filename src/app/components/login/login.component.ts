import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciais } from '../../models/credenciais';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  
  constructor(
    private toast: ToastrService,
    private service: AuthService
  ) {}
  
  creds: Credenciais = {
    email: '',
    senha: ''
  };

  ngOnInit(): void {}

  // MÉTODO PARA LOGIN

  logar(): void {
    this.service.authenticate(this.creds).subscribe(
      resposta => {
        const authorization = resposta.headers.get('Authorization');
        if (authorization) {
          this.toast.info(authorization);
        } else {
          this.toast.error('Cabeçalho de autorização não encontrado');
        }
      },
      () => {
        this.toast.error('Usuário e/ou senha inválidos');
      }
    );
  }
  



 // GRUPO DE CONTROLE DE FORMULÁRIOS

  loginForm = new FormGroup({
    email: new FormControl(this.creds.email, [
      Validators.required,
      Validators.email,
    ]),
    senha: new FormControl(this.creds.senha, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  // VALIDAÇÃO DOS CAMPOS DO FORMULÁRIO DE LOGIN

  validaCampos(): boolean {
    return this.loginForm.valid;
  }
}
