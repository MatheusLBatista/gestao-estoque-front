// Mapeamento de permissões por perfil
export const PERMISSIONS_BY_ROLE = {
  administrador: [
    "produtos",
    "movimentacoes",
    "fornecedores",
    "funcionarios",
    "dashboard",
  ],
  gerente: [
    "produtos",
    "movimentacoes",
    "fornecedores",
    "funcionarios",
    "dashboard",
  ],
  estoquista: ["produtos", "movimentacoes", "fornecedores", "dashboard"],
} as const;

export type UserRole = keyof typeof PERMISSIONS_BY_ROLE;
export type RouteKey =
  | "produtos"
  | "movimentacoes"
  | "fornecedores"
  | "funcionarios"
  | "dashboard";

export function hasPermission(
  role: string | undefined,
  route: RouteKey
): boolean {
  if (!role) return false;

  const userRole = role as UserRole;
  const allowedRoutes = PERMISSIONS_BY_ROLE[userRole];

  if (!allowedRoutes) return false;

  return (allowedRoutes as readonly RouteKey[]).includes(route);
}

export function getAllowedRoutes(
  role: string | undefined
): readonly RouteKey[] {
  if (!role) return [];

  const userRole = role as UserRole;
  return (PERMISSIONS_BY_ROLE[userRole] || []) as readonly RouteKey[];
}

export function isAdmin(role: string | undefined): boolean {
  return role === "administrador";
}

export function isManagerOrAbove(role: string | undefined): boolean {
  return role === "administrador" || role === "gerente";
}

export function canModifyFornecedores(role: string | undefined): boolean {
  return role === "administrador" || role === "gerente";
}

export function canModifyFuncionarios(role: string | undefined): boolean {
  return role === "administrador";
}
