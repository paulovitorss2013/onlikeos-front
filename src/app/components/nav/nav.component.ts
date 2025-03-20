import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  // CONSTRUTOR
  constructor (
    private router:Router,
    private authService: AuthService,
    private toast:ToastrService,
    private dialog: MatDialog
  ) {}
  
  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    this.router.navigate(['']) // DEFINE A PÁGINA INICIAL DO SISTEMA)
  }

  // MÉTODO PARA SAIR DO SISTEMA
  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza de que deseja sair do sistema?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['login']);
        this.toast.info('Você saiu do sistema, até mais!', 'Logout', { timeOut: 4500 });
      }
    });
  }
  
}
