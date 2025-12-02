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
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export interface FuncionariosFilterProps {
  usuario?: string;
  setUsuario: (v: string) => void;
  perfil?: string;
  setPerfil: (v: string) => void;
  status?: string;
  setStatus: (v: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export function FuncionariosFilter({
  usuario,
  setUsuario,
  perfil,
  setPerfil,
  status,
  setStatus,
  onSubmit,
  onClear,
}: FuncionariosFilterProps) {
  useEffect(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [perfil, status]);

  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[360px]">
        <InputGroupInput
          data-test="input-busca-funcionario"
          placeholder="Buscar por nome, matrícula ou email"
          value={usuario || ""}
          onChange={(e) => setUsuario(e.target.value)}
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
        value={perfil || ""}
        onValueChange={(v) => {
          const novo = v === "todos" ? "" : v;
          setPerfil(novo);
          onSubmit;
        }}
      >
        <SelectTrigger className="w-[120px]" data-test="select-perfil-filtro">
          <SelectValue placeholder="Perfil" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos" data-test="select-item-todos">Todos</SelectItem>
            <SelectItem value="administrador" data-test="select-item-administrador">Administrador</SelectItem>
            <SelectItem value="gerente" data-test="select-item-gerente">Gerente</SelectItem>
            <SelectItem value="estoquista" data-test="select-item-estoquista">Estoquista</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={status || ""}
        onValueChange={(v) => {
          const novo = v === "todos" ? "" : v;
          setStatus(novo);
          onSubmit;
        }}
      >
        <SelectTrigger className="w-[120px]" data-test="select-status-filtro">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos" data-test="select-item-status-todos">Todos</SelectItem>
            <SelectItem value="ativo" data-test="select-item-status-ativo">Ativo</SelectItem>
            <SelectItem value="inativo" data-test="select-item-status-inativo">Inativo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {(usuario || perfil || status) && (
        <Button
          data-test="btn-limpar-filtros"
          onClick={() => {
            setUsuario("");
            setPerfil("");
            setStatus("");
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
