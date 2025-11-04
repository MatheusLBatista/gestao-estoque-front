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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface FornecedoresFilterProps {
  nomeFornecedor?: string;
  setNomeFornecedor: (v: string) => void;
  cnpj?: string;
  setCnpj: (v: string) => void;
  email?: string;
  setEmail: (v: string) => void;
  ativo?: boolean | null;
  setAtivo: (v: boolean | null) => void;
  onSubmit?: () => void;
}

export function FornecedoresFilter({
  nomeFornecedor,
  setNomeFornecedor,
  cnpj,
  setCnpj,
  email,
  setEmail,
  ativo,
  setAtivo,
  onSubmit
}: FornecedoresFilterProps) {
  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="Fornecedor"
          value={nomeFornecedor}
          onChange={(e) => setNomeFornecedor(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <Select
          value={ativo === null ? "" : ativo === true ? "true" : "false"}
          onValueChange={(v) => setAtivo(v === "todos" ? null : v === "true")}
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
