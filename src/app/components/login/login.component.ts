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
    private service: AuthService,
    private router: Router
  ) {}
  
  creds: Credenciais = {
    email: '',
    senha: '',
  };

  ngOnInit(): void {}

  // MÉTODO PARA O LOGIN

  logar() {
  
    this.toast.error('Usuário e/ou senha inválido(s)!', 'Login');
    this.creds.senha= '';
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
