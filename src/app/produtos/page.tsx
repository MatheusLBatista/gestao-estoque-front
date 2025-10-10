"use client"

import { useState, useEffect } from "react"
import { TabelaProdutos } from "@/components/tabela"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"


//http://localhost:5011

interface Produto {
  _id: string,
  nome_produto: string,
  descricao: string,
  marca: string,
  custo: string,
  categoria: string,
  estoque: number,
  estoque_min: number,
  data_ultima_entrada: string
}

export default function ProdutosPage() {
  // Substitua pelo seu token real
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGYzNDc0MmEwMWNmN2U1ODRiOTk2YiIsImlhdCI6MTc2MDA2MDU4NSwiZXhwIjoxNzYwMTQ2OTg1fQ.KrRQdf5l96wsEjEVm280P0V0tSgtOx-lLBIuRH65z30"

  const [produtos, setProutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function fetchProdutos() {
    setErro(null)
    setCarregando(true)

    try {
      const response = await fetch('http://localhost:5011/produtos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      const data: Produto[] = result.data?.docs || result.data || []
      setProutos(data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
      setErro(`Erro ao buscar produtos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Estoque de Produtos</h1>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="text-center py-8">
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <TabelaProdutos produtos={produtos} />
        )}
      </main>

      <Footer />
    </div>
  )
}