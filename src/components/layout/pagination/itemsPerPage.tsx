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
  tableData?: any[];
  tableTitle?: string;
  tableColumns?: {
    key: string;
    label: string;
    format?: (value: any, row?: any) => string;
  }[];
}

export function ItemsPerPage({
  perPage,
  setPerPage,
  totalItems,
  tableData = [],
  tableTitle = "Relatório",
  tableColumns = [],
}: ItemsPerPageProps) {
  const options = [10, 20, 30, 50, 100];

  const handlePrint = () => {
    if (!tableData.length || !tableColumns.length) {
      alert("Não há dados para imprimir");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title class='head-title'>${tableTitle}</title>
          <style>
            @page {
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 10px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              font-size: 11px;
            }
            td {
              font-size: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${tableTitle}</h1>
            <p>Gerado em: ${new Date().toLocaleString(
              "pt-BR"
            )} | Total de registros: ${tableData.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                ${tableColumns.map((col) => `<th>${col.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${tableData
                .map(
                  (row) => `
                <tr>
                  ${tableColumns
                    .map((col) => {
                      const value = row[col.key];
                      const formattedValue = col.format
                        ? col.format(value, row)
                        : value;
                      return `<td>${formattedValue || "-"}</td>`;
                    })
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            Sistema de Gestão de Estoque - Página ${Math.ceil(
              tableData.length / perPage
            )} de ${Math.ceil(totalItems / perPage)}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

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
          onClick={handlePrint}
          className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600"
        />
      </div>
    </div>
  );
}
