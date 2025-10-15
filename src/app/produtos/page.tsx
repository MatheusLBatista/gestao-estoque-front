"use client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle";
import { useState, useEffect } from "react";
import TabelaProdutos from "@/components/layout/table/produtoTable";
import { Produto } from "../../lib/Produto";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  async function fetchProdutos() {
    setErro(null);

    try {
      const accessToken =
        process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";

        // TODO:carregar automaticamente 20 produtos ficará mais harmônico na tabela
      const response = await fetch("http://localhost:5011/produtos/?limite=20", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result)
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

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>

        <TabelaProdutos produtos={produtos} />
      </main>

      <Footer />
    </div>
  );
}
