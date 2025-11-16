export interface Produto {
  _id: string;
  nome_produto: string;
  codigo_produto: string;
  descricao: string;
  marca: string;
  fornecedores: {
    _id: string;
    cnpj: string;
    data_cadastro: string;
    data_ultima_atualizacao: string;
    email: string;
    endereco: any[];
    nome_fornecedor: string;
    status: boolean;
    telefone: string;
  };
  custo: number;
  preco?: number;
  categoria: string;
  estoque: number;
  estoque_min: number;
  data_cadastro: string;
  data_ultima_atualizacao: string;
}