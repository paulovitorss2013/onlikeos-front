import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css'] // CORREÇÃO DE styleUrl PARA styleUrls
})
export class ChamadoCreateComponent implements OnInit {

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    prioridade: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required, Validators.minLength(15)]),
    tecnico: new FormControl('', [Validators.required]),
    cliente: new FormControl('', [Validators.required])
  });

  // CONSTRUTOR
  constructor() {}

  ngOnInit(): void {
    // MONITORAR ALTERAÇÕES NO FORMULÁRIO
    this.form.statusChanges.subscribe(status => {
      console.log("Status do formulário:", status);
    });
  }

  // MÉTODO PARA CRIAR UM CHAMADO
  create(): void {
    if (this.form.valid) {
      console.log("Chamado criado:", this.form.value);
    } else {
      console.log("Erro: Formulário inválido!");
    }
  }

  // MÉTODO PARA CONFIRMAR O CANCELAMENTO DAS AÇÕES
  confirmarCancelamento(): void {
    if (window.confirm('Deseja mesmo cancelar?')) {
      console.log("Ação cancelada!");
    }
  }

  // MÉTODO PARA VALIDAR OS CAMPOS DO FORMULÁRIO
  validaCampos(): boolean {
    return this.form.valid;
  }
}
