import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function Navigation() {
  return (
    <Menubar className="bg-transparent border-none text-white">
      <MenubarMenu>
        <MenubarTrigger className="text-white hover:bg-blue-700 data-[state=open]:bg-blue-700">
          Produtos
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/produtos">Gerenciar Produtos</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/produtos/novo">Adicionar Produto</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-white hover:bg-blue-700 data-[state=open]:bg-blue-700">
          Movimentações
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/movimentacoes">Gerenciar Movimentações</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/movimentacoes/novo">Adicionar Movimentação</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-white hover:bg-blue-700 data-[state=open]:bg-blue-700">
          Fornecedores
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/fornecedores">Gerenciar Fornecedores</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/fornecedores/novo">Adicionar Fornecedor</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-white hover:bg-blue-700 data-[state=open]:bg-blue-700">
          Funcionários
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/funcionarios">Gerenciar Funcionários</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/funcionarios/novo">Adicionar Funcionário</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
