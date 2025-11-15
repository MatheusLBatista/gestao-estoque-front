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
import { useEffect } from "react";

export interface ProdutosFilterProps {
  produto?: string;
  setProduto: (v: string) => void;
  categoria?: string;
  setCategoria: (v: string) => void;
  estoqueBaixo?: boolean;
  setEstoqueBaixo: (v: boolean) => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export function ProdutosFilter({
  produto,
  setProduto,
  categoria,
  setCategoria,
  estoqueBaixo,
  setEstoqueBaixo,
  onSubmit,
  onClear,
}: ProdutosFilterProps) {
  useEffect(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [categoria, estoqueBaixo]);

  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[360px]">
        <InputGroupInput
          placeholder="Buscar por nome, código ou marca"
          value={produto || ""}
          onChange={(e) => setProduto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              e.preventDefault?.();
              onSubmit();
            }
          }}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={categoria || ""}
        onValueChange={(v) => {
          const novo = v === "todos" ? "" : v;
          setCategoria(novo);
          onSubmit;
        }}
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

      <div className="flex flex-row items-center space-x-2">
        <Label htmlFor="estoqueBaixo" className="text-muted-foreground">
          Estoque baixo
        </Label>
        <Switch
          id="estoqueBaixo"
          className="cursor-pointer"
          checked={estoqueBaixo || false}
          onCheckedChange={(checked) => {
            setEstoqueBaixo(checked);
            onSubmit;
          }}
        />
      </div>

      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        <ListFilter />
        Filtrar
      </Button>

      {(produto || categoria || estoqueBaixo) && (
        <Button
          onClick={() => {
            setProduto("");
            setCategoria("");
            setEstoqueBaixo(false);
            if (onClear) {
              onClear();
            }
          }}
          variant="outline"
          className="cursor-pointer"
        >
          Limpar
        </Button>
      )}
    </div>
  );
}
