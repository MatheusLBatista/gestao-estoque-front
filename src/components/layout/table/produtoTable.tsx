import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Produto {
  _id: string;
  nome_produto: string;
  descricao: string;
  marca: string;
  custo: number;
  categoria: string;
  estoque: number;
  estoque_min: number;
  data_ultima_entrada: string;
}

interface TabelaProdutosProps {
  produtos: Produto[];
}

export default function TabelaProdutos({ produtos }: TabelaProdutosProps) {
  if (!produtos.length) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">
          Lista de Produtos ({produtos.length} itens)
        </h2>
        {/* adicionar botões de filtros*/}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nome do Produto</TableHead>
            <TableHead className="text-center">Categoria</TableHead>
            <TableHead className="text-center">Marca</TableHead>
            <TableHead className="text-center">Estoque</TableHead>
            <TableHead className="text-center">Custo</TableHead>
            <TableHead className="text-center">Descrição</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto._id}>
              <TableCell className="font-medium text-center">
                {produto.nome_produto}
              </TableCell>
              <TableCell className="text-center">{produto.categoria}</TableCell>
              <TableCell className="text-center">{produto.marca}</TableCell>
              <TableCell className="text-center">{produto.estoque}</TableCell>
              <TableCell className="text-center">
                R$ {produto.custo.toFixed(2)}
              </TableCell>
              <TableCell
                className="max-w-xs truncate"
                title={produto.descricao}
              >
                {produto.descricao}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
