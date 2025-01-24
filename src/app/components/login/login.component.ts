import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  creds: Credenciais = {
    email: '',
    senha: ''
  };

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
    @Inject(PLATFORM_ID) private platformId: Object // INJETA O IDENTIFICADOR DA PLATAFORMA
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return this.loginForm.valid;
  }

  // MÉTODO PARA LOGAR NO SISTEMA
  logar(): void {
    // FAZENDO A VALIDAÇÃO DOS CAMPOS PARA ATIVAR O BOTÃO DE LOGAR
    this.creds.email = this.loginForm.get('email')?.getRawValue() ?? '';
    this.creds.senha = this.loginForm.get('senha')?.getRawValue() ?? '';
    if (!this.validaCampos()) {
      this.toast.warning('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // CHAMANDO O SERVIÇO
    this.service.authenticate(this.creds).subscribe({
      next: (resposta) => {
        console.log('Resposta completa da API:', resposta); // Verificar a resposta da API
        if (resposta.headers && resposta.headers.get('Authorization')) {
          const authorization = resposta.headers.get('Authorization')!;
          console.log('Cabeçalho Authorization recebido:', authorization); // Verificar o token

          // Verifica se estamos no navegador antes de acessar o localStorage
          if (isPlatformBrowser(this.platformId)) {
            this.service.successfulLogin(authorization.substring(7));
          }

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
