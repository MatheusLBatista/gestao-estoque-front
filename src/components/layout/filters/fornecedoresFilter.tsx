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

export interface FornecedoresFilterProps {
  nomeFornecedor?: string;
  setNomeFornecedor: (v: string) => void;
  cnpj?: string;
  setCnpj: (v: string) => void;
  email?: string;
  setEmail: (v: string) => void;
  ativo?: boolean;
  setAtivo: (v: boolean) => void;
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

      <div className="flex flex-row items-center space-x-2">
        <Label htmlFor="ativo" className="text-muted-foreground">
          Ativo
        </Label>
        <Switch
          id="ativo"
          className="cursor-pointer"
          checked={ativo}
          onCheckedChange={setAtivo}
        />
      </div>

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
