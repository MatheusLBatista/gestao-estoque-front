'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';

export default function RedefinirSenhaPage() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  // Validar token ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Link inválido ou expirado');
        setValidatingToken(false);
        setTokenValid(false);
        return;
      }

      try {
        // Verificar se o token é válido fazendo uma requisição simples
        // ou apenas verificar o formato
        setTokenValid(true);
      } catch (err) {
        setError('Link inválido ou expirado');
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redefinir-senha/token?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Erro ao redefinir senha. O link pode ter expirado.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-[#0042D9] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validando link de recuperação...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Link Inválido ou Expirado
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Este link de recuperação de senha não é válido ou já expirou.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/recuperar-senha"
                className="block w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 transition-all"
              >
                Solicitar novo link
              </Link>
              <Link
                href="/login"
                className="block w-full bg-white text-[#0042D9] py-3 px-4 rounded-xl font-medium border-2 border-[#0042D9] hover:bg-blue-50 transition-all"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Senha Redefinida!
          </h1>
          <p className="text-gray-600 mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para a página de login...
          </p>
          <div className="animate-pulse text-[#0042D9] font-medium">
            Redirecionando em 3 segundos...
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-[#0042D9]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Redefinir Senha
            </h1>
            <p className="text-gray-600">
              Digite sua nova senha abaixo
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              id="senha"
              label="Nova Senha"
              value={senha}
              onChange={setSenha}
              placeholder="Digite sua nova senha"
              required
              disabled={loading}
              showStrength
            />

            <PasswordInput
              id="confirmarSenha"
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChange={setConfirmarSenha}
              placeholder="Digite novamente sua senha"
              required
              disabled={loading}
            />

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Requisitos da senha:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${senha.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Mínimo de 6 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${senha === confirmarSenha && senha.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  As senhas devem coincidir
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/login"
              className="text-sm text-gray-600 hover:text-[#0042D9] transition-colors"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
