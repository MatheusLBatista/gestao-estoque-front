import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Produto from "@/types/Produto"

interface TabelaProdutosProps {
  produtos: Produto[]
}

export function TabelaProdutos({ produtos }: TabelaProdutosProps) {
  if (produtos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Nenhum produto encontrado</h2>
        <p className="text-gray-600">Não há produtos cadastrados no momento.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto._id}>
              <TableCell className="font-medium">{produto.nome_produto}</TableCell>
              <TableCell>{produto.categoria}</TableCell>
              <TableCell>{produto.marca}</TableCell>
              <TableCell className="text-right">{produto.estoque}</TableCell>
              <TableCell className="text-right">R$ {produto.custo}</TableCell>
              <TableCell className="max-w-xs truncate" title={produto.descricao}>
                {produto.descricao}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
