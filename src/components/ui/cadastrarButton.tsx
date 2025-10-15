import { Button } from "@/components/ui/button";
import { PackagePlus } from "lucide-react";

interface BotaoCadastrarProps {
  onClick: () => void;
  color?: "green" | "blue";
  size?: "1/2" | "1/8";
}

export function BotaoCadastrar({
  onClick,
  color = "green",
  size = "1/2",
}: BotaoCadastrarProps) {
  const colorClasses =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  const sizeClasses = size === "1/2" ? "w-1/2" : "w-1/8";

  return (
    <Button
      className={`cursor-pointer text-white ${colorClasses} ${sizeClasses}`}
      onClick={onClick}
    >
      <PackagePlus className="w-4 h-4 mr-1" />
      Cadastrar
    </Button>
  );
}
