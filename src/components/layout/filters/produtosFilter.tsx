import { useState } from "react";
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
import { SearchIcon, ListFilter } from "lucide-react"
import { Button } from "@/components/ui/button";

export function ProdutosFilter() {
  const [categoria, setCategoria] = useState<string>("");

  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[240]">
        <InputGroupInput placeholder="Produto" />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <Select value={categoria} onValueChange={(v) => setCategoria(v)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="a">A</SelectItem>
            <SelectItem value="b">B</SelectItem>
            <SelectItem value="c">C</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <InputGroup className="w-[240]">
        <InputGroupInput placeholder="Código do produto" />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>
      
      <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer"><ListFilter />Filtrar</Button>
    </div>
  );
}
