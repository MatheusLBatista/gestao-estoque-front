import { toast } from "sonner";

interface PrintField {
  label: string;
  value: string | React.ReactNode;
}

interface PrintSection {
  title: string;
  fields: PrintField[];
}

interface RecordPrintProps {
  title: string;
  recordId: string;
  sections: PrintSection[];
  onPrint?: () => void;
}

export function useRecordPrint() {
  const printRecord = ({ title, recordId, sections }: RecordPrintProps) => {
    if (!recordId) {
      toast.error("Nenhum registro selecionado para impressão");
      return;
    }

    const generateSectionsHTML = (sections: PrintSection[]) => {
      return sections
        .map(
          (section) => `
        <div class="section">
          <h2>${section.title}</h2>
          <div class="info-grid">
            ${section.fields
              .map(
                (field) => `
              <div class="info-item">
                <div class="info-label">${field.label}</div>
                <div class="info-value">${field.value}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("");
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${recordId}</title>
          <style>
            @page {
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header p {
              margin: 0;
              font-size: 11px;
              color: #666;
            }
            .section {
              margin-bottom: 25px;
            }
            .section h2 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            .info-item {
              display: flex;
              flex-direction: column;
            }
            .info-label {
              font-weight: bold;
              font-size: 10px;
              color: #666;
              margin-bottom: 2px;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 12px;
              color: #333;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
            }
            .status-ativo {
              background-color: #22c55e;
              color: white;
            }
            .status-inativo {
              background-color: #ef4444;
              color: white;
            }
            .status-disponivel {
              background-color: #3b82f6;
              color: white;
            }
            .status-indisponivel {
              background-color: #f59e0b;
              color: white;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Relatório gerado em: ${new Date().toLocaleString("pt-BR")}</p>
          </div>
          
          ${generateSectionsHTML(sections)}
          
          <div class="footer">
            Sistema de Gestão de Estoque - ${title}
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

  return { printRecord };
}

export const createStatusBadge = (
  isActive: boolean,
  activeText = "Ativo",
  inactiveText = "Inativo"
) => {
  return `<span class="status-badge ${
    isActive ? "status-ativo" : "status-inativo"
  }">
    ${isActive ? activeText : inactiveText}
  </span>`;
};

export const createAvailabilityBadge = (isAvailable: boolean) => {
  return `<span class="status-badge ${
    isAvailable ? "status-disponivel" : "status-indisponivel"
  }">
    ${isAvailable ? "Disponível" : "Indisponível"}
  </span>`;
};
