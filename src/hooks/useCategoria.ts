import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { fetchData } from "@/services/api"
import type { CategoriaAResponse, MovimentacoesResponse, Produto, ChartDataItem } from "@/types/Categorias"

interface UseCategoriaResult {
  loading: boolean
  produtosFormatados: Produto[]
  chartData: ChartDataItem[]
  totalEntradas: number
  totalSaidas: number
  totalProdutos: number
}

export function useCategoria(categoria: string): UseCategoriaResult {
  const session = useSession()
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
        console.log("Sessão autenticada, carregando dados...")

        // Buscar produtos da categoria
        console.log(`📡 Buscando produtos da categoria ${categoria}...`)
        const produtosResponse = await fetchData<CategoriaAResponse>(
          `/dashboard/categorias/categoria-${categoria.toLowerCase()}`,
          "GET",
          session.data.user.accesstoken
        )

        console.log("📦 Resposta completa da API de produtos:", JSON.stringify(produtosResponse, null, 2))

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
        
        // Formatar produtos para o formato esperado pela tabela
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
          data_ultima_entrada: '',
        }))
        setProdutosFormatados(produtosFormatadosData)
        setTotalProdutos(produtosResponse.data.total || produtosFormatadosData.length)

        
        // Extrair códigos dos produtos da categoria
        const codigosProdutos = produtosResponse.data.produtos.map((p: any) => p.codigo_produto)
        
        // Buscar movimentações
        const movimentacoesResponse = await fetchData<MovimentacoesResponse>(
          "/movimentacoes?limit=1000",
          "GET",
          session.data.user.accesstoken
        )

        if (!movimentacoesResponse.error && movimentacoesResponse.data) {
          console.log(`🔢 Total de movimentações na API: ${movimentacoesResponse.data.docs.length}`)
          console.log(`🏷️ Códigos de produtos da categoria ${categoria} (${codigosProdutos.length}):`, codigosProdutos.slice(0, 5))
          
          // Filtrar apenas movimentações de produtos da categoria
          const movimentacoesCategoria = movimentacoesResponse.data.docs.filter(mov =>
            mov.produtos.some(p => codigosProdutos.includes(p.codigo_produto))
          )

          // Processar dados para o gráfico
          const dataMap = new Map<string, { entradas: number; saidas: number }>()
          let somaEntradas = 0
          let somaSaidas = 0

          console.log(`📊 Total de movimentações da categoria ${categoria}: ${movimentacoesCategoria.length}`)

          movimentacoesCategoria.forEach((mov, idx) => {
            const date = new Date(mov.data_movimentacao)
            const mesAno = `${date.toLocaleString('pt-BR', { month: 'short' })}/${date.getFullYear().toString().slice(-2)}`
            
            if (idx < 5) {
              console.log(`🗓️ Movimentação ${idx + 1}: ${mov.data_movimentacao} -> ${mesAno}`)
            }
            
            if (!dataMap.has(mesAno)) {
              dataMap.set(mesAno, { entradas: 0, saidas: 0 })
            }

            const current = dataMap.get(mesAno)!
            
            // Somar quantidades apenas dos produtos da categoria
            mov.produtos.forEach(p => {
              if (codigosProdutos.includes(p.codigo_produto)) {
                if (mov.tipo === "entrada") {
                  current.entradas += p.quantidade_produtos
                  somaEntradas += p.quantidade_produtos
                } else {
                  current.saidas += p.quantidade_produtos
                  somaSaidas += p.quantidade_produtos
                }
              }
            })
          })

          setTotalEntradas(somaEntradas)
          setTotalSaidas(somaSaidas)

          console.log(`📈 Total de Entradas: ${somaEntradas}`)
          console.log(`📉 Total de Saídas: ${somaSaidas}`)
          console.log(`📅 Meses únicos no Map:`, Array.from(dataMap.keys()))

          // Função auxiliar para converter mês abreviado em número
          const getMonthNumber = (mesAbrev: string): number => {
            const meses: { [key: string]: number } = {
              'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
              'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
            }
            return meses[mesAbrev.toLowerCase()] ?? -1
          }

          // Converter para array e ordenar por data CORRETAMENTE
          const chartDataArray: ChartDataItem[] = Array.from(dataMap.entries())
            .map(([mesAno, values]) => {
              // Extrair mês e ano corretamente - remover ponto se houver
              const parts = mesAno.split('/')
              const mesAbrev = parts[0].replace('.', '').trim() 
              const ano = parts[1] 
              
              console.log(`🔍 Processando: "${mesAno}" -> mes="${mesAbrev}", ano=20${ano}`)
              
              return {
                mes: mesAno,
                entradas: values.entradas,
                saidas: values.saidas,
                _ano: parseInt(`20${ano}`),
                _mes: getMonthNumber(mesAbrev)
              }
            })
            .sort((a, b) => {
              // Ordenar por ano e depois por mês (CRESCENTE)
              if (a._ano !== b._ano) return a._ano - b._ano
              return a._mes - b._mes
            })
            .map(({ mes, entradas, saidas }) => ({ mes, entradas, saidas })) 

          console.log("📊 Dados do gráfico FINAL ordenados (todos os meses):", chartDataArray)
          setChartData(chartDataArray)
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error)
        toast.error("Erro ao carregar dados da categoria")
      } finally {
        setLoading(false)
        console.log("✅ Carregamento finalizado")
      }
    }

    loadData()
  }, [session.status, session.data, categoria])

  return {
    loading,
    produtosFormatados,
    chartData,
    totalEntradas,
    totalSaidas,
    totalProdutos
  }
}
