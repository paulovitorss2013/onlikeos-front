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
    senha: ''
  };

  ngOnInit(): void {}

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
  
  validaCampos(): boolean {
    return this.loginForm.valid;
  }

  // MÉTODO PARA LOGAR NO SISTEMA

  logar(): void {
    this.creds.email = this.loginForm.get('email')?.getRawValue() ?? '';
    this.creds.senha = this.loginForm.get('senha')?.getRawValue() ?? '';
  
    if (!this.validaCampos()) {
      this.toast.warning('Por favor, preencha todos os campos corretamente.');
      return;
    }
  
    this.service.authenticate(this.creds).subscribe({
      next: (resposta) => {
        console.log('Resposta completa da API:', resposta); // Verificar a resposta da API
        if (resposta.headers && resposta.headers.get('Authorization')) {
          const authorization = resposta.headers.get('Authorization')!;
          console.log('Cabeçalho Authorization recebido:', authorization); // Verificar o token
          this.service.successfulLogin(authorization.substring(7));
          console.log('Token armazenado com sucesso. Redirecionando para home...');
          this.router.navigate(['home']).then(() => {
            console.log('Redirecionado para home com sucesso.');
          }).catch((err) => {
            console.error('Erro ao redirecionar para home:', err);
          });
        } else {
          console.warn('Cabeçalho Authorization não encontrado na resposta da API.');
        }
      },
      error: (erro) => {
        console.error('Erro ao autenticar:', erro); // Verificar possíveis erros na autenticação
        this.toast.error('Usuário e/ou senha inválido(s)');
      },
    });
  }
}