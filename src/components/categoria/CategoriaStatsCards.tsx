"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, TrendingUp, TrendingDown } from "lucide-react"

interface CategoriaStatsCardsProps {
  totalProdutos: number
  totalEntradas: number
  totalSaidas: number
  corEntrada?: string
  corSaida?: string
}

export function CategoriaStatsCards({
  totalProdutos,
  totalEntradas,
  totalSaidas,
  corEntrada = "#0A2852",
  corSaida = "#97BDF2"
}: CategoriaStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Produtos na categoria</p>
              <p className="text-2xl font-bold text-gray-900">{totalProdutos}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unidades recebidas</p>
              <p className="text-2xl font-bold" style={{ color: corEntrada }}>{totalEntradas}</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${corEntrada}15` }}>
              <TrendingUp className="w-6 h-6" style={{ color: corEntrada }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unidades expedidas</p>
              <p className="text-2xl font-bold" style={{ color: corSaida }}>{totalSaidas}</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${corSaida}25` }}>
              <TrendingDown className="w-6 h-6" style={{ color: corSaida }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
