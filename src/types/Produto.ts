export default interface Produto {
  _id: string,
  nome_produto: string,
  descricao: string,
  marca: string,
  custo: string,
  categoria: string,
  estoque: number,
  estoque_min: number,
  data_ultima_entrada: string
}