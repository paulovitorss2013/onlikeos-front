import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciais } from '../../models/credenciais';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  creds: Credenciais = {
    email: '',
    senha: ''
  };

  loading: boolean = false;

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

  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return this.loginForm.valid;
  }

  // INÍCIO DO MÉTODO PARA LOGAR NO SISTEMA
  logar(): void {
    // Atualiza as credenciais com os valores do formulário
    this.creds.email = this.loginForm.get('email')?.value ?? '';
    this.creds.senha = this.loginForm.get('senha')?.value ?? '';

    if (!this.validaCampos()) {
      this.toast.warning('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.loading = true; // Ativa o loading antes da requisição

    this.service.authenticate(this.creds)
      .pipe(
        timeout(8000), // Define um tempo máximo de 10 segundos para a requisição
        catchError((erro) => {
          this.loading = false; // Desativa o loading em caso de erro
          if (erro.name === 'TimeoutError') {
            this.toast.error('Tempo de resposta excedido!', 'Erro de conexão com o servidor');
          }
          return throwError(() => erro);
        })
      )
      .subscribe({
        next: (resposta) => {
          this.loading = false; // Desativa o loading quando receber resposta

          const authorization = resposta.headers?.get('Authorization');
          if (authorization) {
            this.service.successfulLogin(authorization.substring(7)); // Armazena o token
            this.router.navigate(['home']).catch(() => {
              this.toast.error('Erro ao redirecionar para a home.', 'Login');
            });
          } else {
            this.toast.error('Erro ao processar a resposta do servidor.', 'Login');
          }
        },
        error: (erro) => {
          this.loading = false; // Desativa o loading quando houver erro

          if (erro.status === 0) {
            this.toast.error('Erro de conexão com o servidor.', 'Login');
          } else if (erro.status === 403) {
            this.toast.error('Usuário e/ou senha inválidos', 'Login');
          }
        }
      });
  }
  // FIM DO MÉTODO PARA LOGAR NO SISTEMA
}
