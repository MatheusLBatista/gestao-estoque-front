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
import { SearchIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MovimentacaoFilterProps {
  produtos?: string;
  setProdutos: (v: string) => void;
  tipoProduto?: string;
  setTipoProduto: (v: string) => void;
  dataInicial?: string;
  setDataInicial: (v: string) => void;
  dataFinal?: string;
  setDataFinal: (v: string) => void;
  onSubmit?: () => void;
}

function CalendarPicker({
  label,
  selectedDate,
  onDateChange,
}: {
  label: string;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={label} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={label}
            className="w-48 justify-between font-normal"
          >
            {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              onDateChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function MovimentacoesFilter({
  produtos,
  setProdutos,
  tipoProduto,
  setTipoProduto,
  dataInicial,
  setDataInicial,
  dataFinal,
  setDataFinal,
  onSubmit,
}: MovimentacaoFilterProps) {
  return (
    <div className="mb-4 flex flex-row gap-4">
      <InputGroup className="w-[240px]">
        <InputGroupInput
          placeholder="Produto"
          value={produtos}
          onChange={(e) => setProdutos(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon className="cursor-pointer" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={tipoProduto || ""}
        onValueChange={(v) => setTipoProduto(v === "todos" ? "" : v)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="entrada">Entrada</SelectItem>
            <SelectItem value="saida">Saída</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <CalendarPicker
        label="Data Inicial"
        selectedDate={dataInicial ? new Date(dataInicial) : undefined}
        onDateChange={(date) =>
          setDataInicial(date ? date.toISOString().split("T")[0] : "")
        }
      />

      <CalendarPicker
        label="Data Final"
        selectedDate={dataFinal ? new Date(dataFinal) : undefined}
        onDateChange={(date) =>
          setDataFinal(date ? date.toISOString().split("T")[0] : "")
        }
      />

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
