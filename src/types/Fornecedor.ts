interface Endereco {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Fornecedor {
  _id: string;
  cnpj: string;
  data_cadastro: string;
  data_ultima_atualizacao: string;
  email: string;
  endereco: Endereco[];
  nome_fornecedor: string;
  status: boolean;
  telefone: string;
}
