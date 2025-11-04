import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

interface ItemsPerPageProps {
  perPage: number;
  setPerPage: (value: number) => void;
  totalItems: number;
}

export function ItemsPerPage({
  perPage,
  setPerPage,
  totalItems,
}: ItemsPerPageProps) {
  
  const options = [10, 20, 30, 50, 100];

  return (
    <div className="text-xs text-neutral-500 flex items-center gap-2">
      <span>Exibindo</span>
      
        <Select
          value={String(perPage)}
          onValueChange={(v) => setPerPage(Number(v))}
        >
          <SelectTrigger className="w-[73px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      
      <span>de {totalItems}</span>
      <div className="flex px-3">
        <Printer
          onClick={() => window.print()}
          className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600"
        />
      </div>
    </div>
  );
}
