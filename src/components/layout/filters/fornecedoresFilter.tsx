import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FornecedoresFilterProps {
  nomeFornecedor?: string;
  setNomeFornecedor: (v: string) => void;
  ativo?: boolean | null;
  setAtivo: (v: boolean | null) => void;
  onSubmit?: () => void;
  onStatusChange?: (newStatus: boolean | null) => void;
}

export function FornecedoresFilter({
  nomeFornecedor,
  setNomeFornecedor,
  ativo,
  setAtivo,
  onSubmit,
  onStatusChange,
}: FornecedoresFilterProps) {
  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-100">
        <InputGroupInput
          placeholder="Buscar por nome ou CNPJ"
          value={nomeFornecedor}
          onChange={(e) => setNomeFornecedor(e.target.value)}
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
        value={ativo === null ? "todos" : ativo === true ? "true" : "false"}
        onValueChange={(v) => {
          const novo = v === "todos" ? null : v === "true";
          setAtivo(novo);
          onStatusChange?.(novo);
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        <ListFilter />
        Filtrar
      </Button>
    </div>
  );
}
