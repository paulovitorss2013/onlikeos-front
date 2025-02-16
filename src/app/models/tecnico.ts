export interface Tecnico {
    id?: any;
    nome: string;
    cpf: string;
    email: string;
    celular: string;
    senha: string;
    perfis: string[];  // Alterado para um array de strings
    dataCriacao: any;
  }
