"use client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle/subtitle";
import { useState } from "react";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "@/components/layout/table/produtoTable";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  async function fetchProdutos() {
    setErro(null);

    try {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGMyZTk3OGE0NWIwMmM2ZDA0N2JmOCIsImlhdCI6MTc2MDMxMzYxNywiZXhwIjoxNzYwNDAwMDE3fQ.npotO-694DrgQ3S0Sbe8Vb6y9CEVvCLOFZk2kZv4uCA";

      const response = await fetch("http://localhost:5011/produtos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      const data: Produto[] = result.data?.docs || result.data || [];
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setErro(
        `Erro ao buscar produtos: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`
      );
    }
  }

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>

        <Button onClick={fetchProdutos} className="mb-6">
          Buscar Produtos na API
        </Button>

        <TabelaProdutos produtos={produtos} />
      </main>

      <Footer />
    </div>
  );
}
