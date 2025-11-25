'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        // Mesmo se o email não existir, não revelar isso por segurança
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-[#0042D9]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-600">
              Digite seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-green-800 mb-1">Email enviado!</h3>
                <p className="text-sm text-green-700">
                  Se existe uma conta com este email, você receberá instruções para redefinir sua senha.
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-[#0042D9] focus:bg-white outline-none transition-all"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
              </button>
            </form>
          )}

          {/* Success Actions */}
          {success && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-[#0042D9] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0042D9]/90 focus:ring-2 focus:ring-[#0042D9] focus:ring-offset-2 transition-all shadow-lg"
              >
                Ir para o Login
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className="w-full bg-white text-[#0042D9] py-3 px-4 rounded-xl font-medium border-2 border-[#0042D9] hover:bg-blue-50 transition-all"
              >
                Enviar para outro email
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#0042D9] transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Não recebeu o email?{' '}
            <button
              onClick={() => {
                setSuccess(false);
                setError('');
              }}
              className="text-[#0042D9] hover:underline font-medium"
            >
              Tentar novamente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
