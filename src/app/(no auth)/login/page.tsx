"use client"

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";
import { LoaderIcon } from "lucide-react";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [manterLogado, setManterLogado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Verifica se deve redirecionar baseado em manter logado
  useEffect(() => {
    if (status === "authenticated") {
      // limpa localStorage
      if ((session as any)?.error === "RefreshAccessTokenError") {
        localStorage.removeItem("manterLogado");
        return;
      }

      const manterLogadoStorage = localStorage.getItem("manterLogado");
      
      // Se manterLogado está ativo, redireciona para home
      if (manterLogadoStorage === "true") {
        router.push("/home");
      } else {
        // Se não está ativo, faz logout silencioso para permitir novo login
        localStorage.removeItem("manterLogado");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Salva a preferência de manter logado no localStorage
      localStorage.setItem("manterLogado", manterLogado.toString());

      const result = await signIn("credentials", {
        matricula: matricula,
        senha: senha,
        manterLogado: manterLogado,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Verifique sua matrícula e senha.");
      } else {
        router.push("/home");
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
          <LoaderIcon role="status" className="animate-spin mt-20 mx-auto" />
      </div>
    );
  }

  // Não renderiza o formulário se já estiver autenticado E manterLogado estiver ativo
  if (status === "authenticated") {
    // Se tem erro de refresh token, mostra o formulário
    if ((session as any)?.error === "RefreshAccessTokenError") {
      // Permite mostrar o formulário para novo login
    } else {
      const manterLogadoStorage = typeof window !== "undefined" ? localStorage.getItem("manterLogado") : null;
      if (manterLogadoStorage === "true") {
        return null; 
      }
    }
    // Se não está com manterLogado, mostra o formulário normalmente
  }

  return (
    <div>
      <main className="min-h-screen bg-white p-6 flex flex-col relative overflow-hidden">

        <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold">Gestão de Estoque</h1>
        </div>

        <div 
          className="absolute w-[2500px] h-[2500px] pointer-events-none"
          style={{
            right: '-400.05px',
            top: '-251.77px',
            transform: 'rotate(15deg)',
            transformOrigin: 'center'
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-tl-full"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 relative z-10">
          

          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Login</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-2">
                      Matrícula*
                    </label>
                    <input
                      type="text"
                      id="matricula"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#0042D9] focus:bg-white outline-none transition-all"
                      placeholder="Digite sua matrícula"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha*
                    </label>
                    <input
                      type="password"
                      id="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#0042D9] focus:bg-white outline-none transition-all"
                      placeholder="Digite sua senha"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="manterLogado"
                      checked={manterLogado}
                      onChange={(e) => setManterLogado(e.target.checked)}
                      className="h-4 w-4 text-[#0042D9] focus:ring-[#0042D9] border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label htmlFor="manterLogado" className="ml-2 block text-sm text-gray-700">
                      Manter logado
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-600">Esqueceu a senha? </span>
                  <button 
                    type="button"
                    className="text-sm text-[#0042D9] hover:underline font-medium"
                  >
                    Clique aqui
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
