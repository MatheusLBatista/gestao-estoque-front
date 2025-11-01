interface BaseMovimentacao {
  _id: string;
  destino: string;
  id_usuario: {
    _id: string;
    nome_usuario: string;
    email: string;
  };
  status: boolean;
  observacoes: string;
  data_movimentacao: string;
  data_cadastro: string;
  data_ultima_atualizacao: string;
  totalProdutos?: number;
  totalCusto?: number;
  totalPreco?: number;
}

export interface ProdutoPopulado {
  _id: string;
  nome_produto: string;
  estoque: number;
}

export interface MovimentacaoEntrada extends BaseMovimentacao {
  tipo: "entrada";
  nota_fiscal: {
    numero: string;
    serie: string;
    chave: string;
    data_emissao: string;
  };
  produtos: {
    _id: ProdutoPopulado | string;
    codigo_produto: string;
    quantidade_produtos: number;
    custo: number;
  }[];
}

export interface MovimentacaoSaida extends BaseMovimentacao {
  tipo: "saida";
  produtos: {
    _id: ProdutoPopulado | string;
    codigo_produto: string;
    quantidade_produtos: number;
    preco: number;
  }[];
}

export type Movimentacao = MovimentacaoEntrada | MovimentacaoSaida;
