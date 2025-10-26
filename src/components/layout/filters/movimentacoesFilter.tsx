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
import {
  SearchIcon,
  ListFilter,
  CalendarDays,
  ArrowRightLeft,
} from "lucide-react";
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
  placeholder,
  selectedDate,
  onDateChange,
}: {
  placeholder: string;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-[180px] justify-between font-normal cursor-pointer ${
            !selectedDate ? "text-muted-foreground" : ""
          }`}
        >
          {selectedDate
            ? selectedDate.toLocaleDateString("pt-BR")
            : placeholder}
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
        <SelectTrigger className="w-[120px] cursor-pointer">
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

      <div className="flex flex-row items-center gap-1">
        <CalendarDays className="text-muted-foreground" />
        <CalendarPicker
          placeholder="Data Inicial"
          selectedDate={
            dataInicial
              ? (() => {
                  const [day, month, year] = dataInicial.split("-");
                  return new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                  );
                })()
              : undefined
          }
          onDateChange={(date) => {
            if (date) {
              const day = date.getDate().toString().padStart(2, "0");
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const year = date.getFullYear();
              setDataInicial(`${day}-${month}-${year}`);
            } else {
              setDataInicial("");
            }
          }}
        />
      </div>

      <div className="flex flex-row items-center">
        <ArrowRightLeft className="text-muted-foreground w-4 h-4" />
      </div>

      <div className="flex flex-row items-center gap-1">
        <CalendarDays className="text-muted-foreground" />
        <CalendarPicker
          placeholder="Data Final"
          selectedDate={
            dataFinal
              ? (() => {
                  const [day, month, year] = dataFinal.split("-");
                  return new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                  );
                })()
              : undefined
          }
          onDateChange={(date) => {
            if (date) {
              const day = date.getDate().toString().padStart(2, "0");
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const year = date.getFullYear();
              setDataFinal(`${day}-${month}-${year}`);
            } else {
              setDataFinal("");
            }
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
    </div>
  );
}
