export function AdjustDate(dataIso: string): string {
  if (!dataIso) return "Data não disponível";

  if (/^\d{2}\/\d{2}\/\d{4}/.test(dataIso)) return dataIso;

  if (/^\d{2}-\d{2}-\d{4}$/.test(dataIso)) return dataIso.replace(/-/g, '/');

  const data = new Date(dataIso);
  if (isNaN(data.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}


export function AdjustDateOnly(dataIso: string): string {
  if (!dataIso) return "Data não disponível";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataIso)) return dataIso;

  if (/^\d{2}-\d{2}-\d{4}$/.test(dataIso)) return dataIso.replace(/-/g, '/');

  const data = new Date(dataIso);
  if (isNaN(data.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(data);
}
