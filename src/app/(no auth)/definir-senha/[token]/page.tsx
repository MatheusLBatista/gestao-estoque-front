'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';

export default function DefinirSenhaPage() {
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
        setError(data.message || 'Erro ao definir senha. O link pode ter expirado.');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-[#0042D9] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validando seu convite...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Link Inválido ou Expirado
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Este link para definir senha não é válido ou já expirou.'}
            </p>
            <Link
              href="/login"
              className="block w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 transition-all"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Conta Ativada! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Sua senha foi definida com sucesso e sua conta está ativa. 
            Você já pode fazer login no sistema!
          </p>
          <div className="animate-pulse text-[#0042D9] font-medium">
            Redirecionando para o login em 3 segundos...
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo! 🎉
            </h1>
            <p className="text-gray-600">
              Defina sua senha para ativar sua conta e começar a usar o sistema
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Primeiro acesso:</strong> Crie uma senha segura para proteger sua conta.
              Após definir sua senha, você poderá fazer login no sistema.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              id="senha"
              label="Senha"
              value={senha}
              onChange={setSenha}
              placeholder="Crie uma senha segura"
              required
              disabled={loading}
              showStrength
            />

            <PasswordInput
              id="confirmarSenha"
              label="Confirmar Senha"
              value={confirmarSenha}
              onChange={setConfirmarSenha}
              placeholder="Digite novamente sua senha"
              required
              disabled={loading}
            />

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Sua senha deve ter:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${senha.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  No mínimo 6 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${senha === confirmarSenha && senha.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  As senhas devem coincidir
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                💡 Dica: Use uma combinação de letras, números e caracteres especiais para maior segurança
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Ativando conta...' : 'Ativar Conta e Definir Senha'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Já tem uma senha?{' '}
              <Link 
                href="/login"
                className="text-[#0042D9] hover:underline font-medium"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
