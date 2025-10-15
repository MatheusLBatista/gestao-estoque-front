export function AdjustPrice(valor: string | number): string {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;

  if (isNaN(numero)) return "—"; 

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
