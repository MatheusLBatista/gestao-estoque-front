import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { SearchIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface ProdutosFilterProps {
  nomeProduto?: string;
  setNomeProduto: (v: string) => void;
  codigoProduto?: string;
  setCodigoProduto: (v: string) => void;
  categoria?: string;
  setCategoria: (v: string) => void;
  estoqueBaixo?: boolean;
  setEstoqueBaixo: (v: boolean) => void;
  onSubmit?: () => void;
}

export function ProdutosFilter({
  nomeProduto,
  setNomeProduto,
  codigoProduto,
  setCodigoProduto,
  categoria,
  setCategoria,
  estoqueBaixo,
  setEstoqueBaixo,
  onSubmit,
}: ProdutosFilterProps) {
  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="Produto"
          value={nomeProduto || ""}
          onChange={(e) => setNomeProduto(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={categoria || ""}
        onValueChange={(v) => setCategoria(v === "todos" ? "" : v)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="a">A</SelectItem>
            <SelectItem value="b">B</SelectItem>
            <SelectItem value="c">C</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="Código do produto"
          value={codigoProduto || ""}
          onChange={(e) => setCodigoProduto(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-row items-center space-x-2">
        <Label htmlFor="estoqueBaixo" className="text-muted-foreground">
          Estoque baixo
        </Label>
        <Switch
          id="estoqueBaixo"
          className="cursor-pointer"
          checked={estoqueBaixo || false}
          onCheckedChange={setEstoqueBaixo}
        />
      </div>

      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        <ListFilter />
        Filtrar
      </Button>
      
      <Button
        onClick={() => {
          setNomeProduto("");
          setCodigoProduto("");
          setCategoria("");
          setEstoqueBaixo(false);
          if (onSubmit) {
            setTimeout(() => onSubmit(), 100);
          }
        }}
        variant="outline"
        className="cursor-pointer"
      >
        Limpar
      </Button>
    </div>
  );
}
