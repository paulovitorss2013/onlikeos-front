import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrl: './chamado-create.component.css'
})
export class ChamadoCreateComponent implements OnInit {

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({

  });

  // CONSTRUTOR
  constructor( ) {}

  ngOnInit(): void {}

 // MÉTODO PARA CRIAR UM CLIENTE
create(): void {

}

  // MÉTODO PARA CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {

    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
