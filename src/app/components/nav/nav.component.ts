import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor (
    private router:Router,
    private authService: AuthService,
    private toast:ToastrService) {}

  ngOnInit(): void {
    //NAVEGANDO PARA A ROTA HOME (DEFINE A PÁGINA DE START)
    this.router.navigate(['tecnicos/create']) 
  }

  // MÉTODO PARA SAIR DO SISTEMA
  logout() {
    const confirmacao = window.confirm("Tem certeza que deseja sair?");
    if (confirmacao) {
      this.router.navigate(['login']);
      this.authService.logout();
      this.toast.info('Você saiu do sistema, até mais!', 'Logout', { timeOut: 4500 });
    }
  }

}
