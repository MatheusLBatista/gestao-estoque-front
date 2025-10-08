import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TypographyH2 } from "@/components/layout/subtitle/subtitle";

export default function ProdutosPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen p-8">
        <TypographyH2>Estoque de produtos</TypographyH2>
      </main>
      <Footer />
    </div>
  );
}
