export function AdjustDate(dataIso: string): string {
  if (!dataIso || dataIso === null || dataIso === undefined) {
    return "Data não disponível";
  }

  const data = new Date(dataIso);

  if (isNaN(data.getTime())) {
    return "Data inválida";
  }

  const formatador = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatador.format(data);
}
