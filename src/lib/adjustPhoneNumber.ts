export const formatarTelefone = (value: string) => {
  let telefone = value.replace(/\D/g, "");
  telefone = telefone.slice(0, 11);
  if (telefone.length <= 10) {
    return telefone
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{4})/, "$1-$2");
  }
  return telefone
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})/, "$1-$2");
};
