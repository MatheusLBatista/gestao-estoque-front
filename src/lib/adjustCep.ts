export const formatarCep = (value: string) => {
  const cep = value.replace(/\D/g, "");
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
};
