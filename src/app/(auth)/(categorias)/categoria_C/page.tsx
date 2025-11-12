"use client"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TabelaCategoriaProdutos from "@/components/layout/table/categoriaTable"
import { CategoriaStatsCards } from "@/components/categoria/CategoriaStatsCards"
import { CategoriaChart } from "@/components/categoria/CategoriaChart"
import { useCategoria } from "@/hooks/useCategoria"
import { LoaderIcon } from "lucide-react"

export default function CategoriaCPage() {
  const {
    loading,
    produtosFormatados,
    chartData,
    totalEntradas,
    totalSaidas,
    totalProdutos
  } = useCategoria("C")

  const corEntrada = "#0A2852"
  const corSaida = "#97BDF2"

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon className="w-8 h-8 animate-spin text-red-600" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Categoria C - Produtos de Baixo Valor
          </h1>

          <CategoriaStatsCards
            totalProdutos={totalProdutos}
            totalEntradas={totalEntradas}
            totalSaidas={totalSaidas}
            corEntrada={corEntrada}
            corSaida={corSaida}
          />

          <CategoriaChart
            data={chartData}
            titulo="Movimentações de Produtos - Categoria C"
            descricao="Entradas e saídas dos últimos meses"
            corEntrada={corEntrada}
            corSaida={corSaida}
            categoria="C"
          />

          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Lista de Produtos
            </h2>
            <TabelaCategoriaProdutos produtos={produtosFormatados} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
