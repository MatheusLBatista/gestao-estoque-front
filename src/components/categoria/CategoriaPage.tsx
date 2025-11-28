"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoaderIcon, ArrowLeft } from "lucide-react"
import { fetchData } from "@/services/api"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TabelaCategoriaProdutos from "@/components/layout/table/categoriaTable"
import { CategoriaStatsCards } from "./CategoriaStatsCards"
import { CategoriaChart } from "./CategoriaChart"
import { Button } from "@/components/ui/button"
import type { CategoriaAResponse, MovimentacoesResponse, Produto, ChartDataItem } from "@/types/Categorias"

interface CategoriaPageProps {
  categoria: string
  titulo: string
  corEntrada?: string
  corSaida?: string
}

export function CategoriaPage({
  categoria,
  titulo,
  corEntrada = "#0A2852",
  corSaida = "#97BDF2"
}: CategoriaPageProps) {
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [produtosFormatados, setProdutosFormatados] = useState<Produto[]>([])
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [totalEntradas, setTotalEntradas] = useState(0)
  const [totalSaidas, setTotalSaidas] = useState(0)
  const [totalProdutos, setTotalProdutos] = useState(0)

  useEffect(() => {
    async function loadData() {
      if (session.status !== "authenticated" || !session.data?.user?.accesstoken) {
        return
      }

      try {
        setLoading(true)

        const produtosResponse = await fetchData<CategoriaAResponse>(
          `/dashboard/categorias/categoria-${categoria.toLowerCase()}`,
          "GET",
          session.data.user.accesstoken
        )

        if (produtosResponse.error) {
          toast.error("Erro ao buscar produtos da categoria")
          setLoading(false)
          return
        }

        if (!produtosResponse.data) {
          toast.error("Nenhum dado encontrado")
          setLoading(false)
          return
        }

        if (!produtosResponse.data.produtos || produtosResponse.data.produtos.length === 0) {
          toast.info(`Nenhum produto encontrado na categoria ${categoria}`)
          setLoading(false)
          return
        }
        
        const produtosFormatadosData: Produto[] = produtosResponse.data.produtos.map((p: any) => ({
          _id: p._id,
          nome_produto: p.nome_produto,
          codigo_produto: p.codigo_produto,
          descricao: p.descricao || '',
          marca: p.marca || '',
          fornecedores: p.fornecedores || {} as any,
          custo: p.custo,
          preco: p.preco,
          categoria: p.categoria,
          estoque: p.estoque,
          estoque_min: p.estoque_min || 0,
          data_cadastro: '',
          data_ultima_atualizacao: '',
        }))
        setProdutosFormatados(produtosFormatadosData)
        setTotalProdutos(produtosResponse.data.total || produtosFormatadosData.length)

        
        const codigosProdutos = produtosResponse.data.produtos.map((p: any) => p.codigo_produto)
        
        const movimentacoesResponse = await fetchData<MovimentacoesResponse>(
          "/movimentacoes?limit=5000",
          "GET",
          session.data.user.accesstoken
        )

        if (!movimentacoesResponse.error && movimentacoesResponse.data) {
          console.log(`Total de movimentações: ${movimentacoesResponse.data.docs.length}`)
          console.log(`Códigos de produtos da categoria ${categoria} (${codigosProdutos.length}):`, codigosProdutos.slice(0, 5))
          
          const movimentacoesCategoria = movimentacoesResponse.data.docs.filter(mov =>
            mov.produtos.some(p => codigosProdutos.includes(p.codigo_produto))
          )

          const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
          ]

          // Inicializa dados 
          const dataMap = new Map<string, { entradas: number; saidas: number; mesIndex: number }>()
          meses.forEach((mes, index) => {
            dataMap.set(mes, { entradas: 0, saidas: 0, mesIndex: index })
          })

          let somaEntradas = 0
          let somaSaidas = 0

          console.log(`Total de movimentações da categoria ${categoria}: ${movimentacoesCategoria.length}`)

          let entradasCount = 0
          let saidasCount = 0

          movimentacoesCategoria.forEach((mov, idx) => {
            const date = new Date(mov.data_movimentacao)
            const ano = date.getFullYear()
            const mesIndex = date.getMonth() 
            const nomeMes = meses[mesIndex]
            
            if (idx < 5) {
              console.log(`Movimentação ${idx + 1}: tipo=${mov.tipo}, ano=${ano}, data=${mov.data_movimentacao} -> ${nomeMes}, produtos:`, mov.produtos)
            }

            const current = dataMap.get(nomeMes)!
            
            mov.produtos.forEach(p => {
              if (codigosProdutos.includes(p.codigo_produto)) {
                if (mov.tipo === "entrada") {
                  current.entradas += p.quantidade_produtos
                  somaEntradas += p.quantidade_produtos
                  entradasCount++
                } else {
                  current.saidas += p.quantidade_produtos
                  somaSaidas += p.quantidade_produtos
                  saidasCount++
                }
              }
            })
          })

          console.log(`Categoria ${categoria}: ${entradasCount} entradas, ${saidasCount} saídas processadas`)
          console.log(`Total entradas: ${somaEntradas}, Total saídas: ${somaSaidas}`)

          setTotalEntradas(somaEntradas)
          setTotalSaidas(somaSaidas)

          // Converte para array mantendo a ordem dos meses (Janeiro a Dezembro)
          const chartDataArray: ChartDataItem[] = Array.from(dataMap.entries())
            .map(([mes, values]) => ({
              mes,
              entradas: values.entradas,
              saidas: values.saidas,
              mesIndex: values.mesIndex
            }))
            .sort((a, b) => a.mesIndex - b.mesIndex)
            .map(({ mes, entradas, saidas }) => ({ mes, entradas, saidas }))

          setChartData(chartDataArray)
        }
      } catch (error: any) {
        toast.error("Erro ao carregar dados da categoria")
      } finally {
        setLoading(false)

      }
    }

    loadData()
  }, [session.status, session.data, categoria])

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
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
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/home')}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {titulo}
            </h1>
          </div>

          <CategoriaStatsCards
            totalProdutos={totalProdutos}
            totalEntradas={totalEntradas}
            totalSaidas={totalSaidas}
            corEntrada={corEntrada}
            corSaida={corSaida}
          />

          <CategoriaChart
            data={chartData}
            titulo={`Movimentações de Produtos - Categoria ${categoria}`}
            descricao="Entradas e saídas dos últimos meses"
            corEntrada={corEntrada}
            corSaida={corSaida}
            categoria={categoria}
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
