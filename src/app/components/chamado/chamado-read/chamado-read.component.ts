import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../../models/chamado';
import { FormControl, FormGroup } from '@angular/forms';
import { ChamadoService } from '../../../services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chamado-read',
  templateUrl: './chamado-read.component.html',
  styleUrl: './chamado-read.component.css'
})
export class ChamadoReadComponent implements OnInit {
  
  // INSTÂNCIA DO CHAMADO
  chamado: Chamado = {
    titulo: '',
    dataAbertura: '',
    prioridade: '',
    status: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
    dataFechamento: '',
    observacoes: '',
    procedimentos: ''
    
  };

  // GRUPO DE FORMULÁRIOS REATIVOS
  form: FormGroup = new FormGroup({
    titulo: new FormControl({ value: '', disabled: true }),
    dataAbertura: new FormControl({ value: '', disabled: true }),
    prioridade: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '', disabled: true }),
    tecnico: new FormControl({ value: '', disabled: true }),
    cliente: new FormControl({ value: '', disabled: true }),
    dataFechamento: new FormControl({ value: '', disabled: true }),
    observacoes: new FormControl({ value: '', disabled: true }),
    procedimentos: new FormControl({ value: '', disabled: true }),
  });

  // CONSTRUTOR
  constructor(
    private chamadoService: ChamadoService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chamado.id = id;
      this.findById();
    }
  }

// MÉTODO BUSCAR AS INFORMAÇÕES PELO ID
findById(): void {
  this.chamadoService.findById(this.chamado.id).subscribe({
    next: (resposta) => {
      this.chamado = resposta;
      const procedimentos = this.chamado.procedimentos?.trim() || 'Nenhum procedimento registrado para esse chamado.';
      
      this.form.patchValue({
        titulo: this.chamado.titulo,
        dataAbertura: this.chamado.dataAbertura,
        prioridade: this.chamado.prioridade.toString(),
        status: this.chamado.status.toString(),
        tecnico: this.chamado.nomeTecnico,
        cliente: this.chamado.nomeCliente,
        dataFechamento: this.chamado.dataFechamento,
        observacoes: this.chamado.observacoes,
        procedimentos: procedimentos
      });
    },
    error: (ex) => {
      this.toastrService.error(ex.error.error);
    }
  });
}

  // VOLTA PARA A TELA DOS CHAMADOS
  voltar(): void {
    this.router.navigate(['chamados']);
  }
}