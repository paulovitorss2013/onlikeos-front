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
    //NAVEGANDO PARA A ROTA HOME
    this.router.navigate(['']) 
  }

  // MÉTODO PARA SAIR DO SISTEMA

  logout() {
    this.router.navigate(['login'])
    this.authService.logout();
    this.toast.info('Você saiu do sistema, até mais!', 'logout', {timeOut:4500})
  }

}
