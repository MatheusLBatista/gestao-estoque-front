export interface ProdutoAPI {
  _id: string
  nome_produto: string
  codigo_produto: string
  descricao?: string
  preco: number
  custo: number
  estoque: number
  marca?: string
  categoria: string
  estoque_min?: number
  status?: boolean
  fornecedores?: any
  nome_fornecedor?: string
  id_fornecedor?: number
}

export interface CategoriaAResponse {
  error: boolean
  code: number
  message: string
  data: {
    categoria: string
    descricao: string
    total: number
    produtos: ProdutoAPI[]
  }
  errors: any[]
}

export interface MovimentacaoData {
  tipo: "entrada" | "saida"
  destino: string
  data_movimentacao: string
  produtos: {
    codigo_produto: string
    quantidade_produtos: number
    preco?: number
    custo?: number
  }[]
}

export interface MovimentacoesResponse {
  error: boolean
  code: number
  message: string
  data: {
    docs: MovimentacaoData[]
  }
  errors: any[]
}

export interface ChartDataItem {
  mes: string
  entradas: number
  saidas: number
}

export interface Produto {
  _id: string
  nome_produto: string
  codigo_produto: string
  descricao: string
  marca: string
  fornecedores: any
  custo: number
  preco: number
  categoria: string
  estoque: number
  estoque_min: number
  data_cadastro: string
  data_ultima_entrada: string
}
