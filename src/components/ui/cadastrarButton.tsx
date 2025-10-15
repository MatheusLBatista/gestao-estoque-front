import { Button } from "@/components/ui/button"
import { PackagePlus } from "lucide-react"

interface BotaoCadastrarProps {
  onClick: () => void
  color?: "green" | "blue"
  size?: "half" | "eighth"
}

export function BotaoCadastrar({ onClick, color = "green", size = "half" }: BotaoCadastrarProps) {
  const colorClasses =
    color === "green"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700"

  const sizeClasses = size === "half" ? "w-1/2" : "w-1/8"

  return (
    <Button
      className={`cursor-pointer text-white ${colorClasses} ${sizeClasses}`}
      onClick={onClick}
    >
      <PackagePlus className="w-4 h-4 mr-1" />
      Cadastrar
    </Button>
  )
}
