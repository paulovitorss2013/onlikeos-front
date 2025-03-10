import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
  
  // DECLARAÇÃO DAS CREDENCIAIS
  creds: Credenciais = {
    email: '',
    senha: ''
  };

  // VARIÁVEL DE CONTROLE DE CARREGAMENTO
  loading: boolean = false;

  // FORMULÁRIO DE LOGIN
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
  
  // CONSTRUTOR DO COMPONENTE
  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // MÉTODO DE INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {}

  // MÉTODO PARA VALIDAR O FORMULÁRIO
  validaCampos(): boolean {
    return this.loginForm.valid;
  }

  // MÉTODO PARA LOGAR NO SISTEMA
  logar(): void {
    this.creds.email = this.loginForm.get('email')?.value ?? '';
    this.creds.senha = this.loginForm.get('senha')?.value ?? '';
  
    if (!this.validaCampos()) {
      this.toast.warning('Por favor, preencha todos os campos corretamente.');
      return;
    }
  
    this.loading = true;
  
    this.service.authenticate(this.creds)
      .pipe(
        timeout(8000),
        catchError((erro) => {
          this.loading = false;
          if (erro.name === 'TimeoutError') {
            this.toast.error('Tempo de resposta excedido!', 'Erro de conexão com o servidor');
          }
          return throwError(() => erro);
        })
      )
      .subscribe({
        next: (resposta) => {
          this.loading = false;
  
          const authorization = resposta.headers?.get('Authorization');
          if (authorization) {
            this.service.successfulLogin(authorization.substring(7));
            this.router.navigate(['home']).catch(() => {
              this.toast.error('Erro ao redirecionar para a home.', 'Login');
            });
          } else {
            this.toast.error('Erro ao processar a resposta do servidor.', 'Login');
          }
        },
        error: (erro) => {
          this.loading = false;
  
          if (erro.status === 0) {
            this.toast.error('Erro de conexão com o servidor.', 'Login');
          } else if (erro.status === 403) {
            this.toast.error('Usuário e/ou senha inválidos', 'Login');
          }
        }
      });
  }
}
