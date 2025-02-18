export interface Cliente {
  id?: any;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  senha: string;
  perfis: string[];
  dataCriacao?: any;
}