import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProdutosFilter() {
  const [categoria, setCategoria] = useState<string>("");

  return (
    <div className="mb-4">
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
    </div>
  );
}
