import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * Função auxiliar para renovar o access token usando o refresh token.
 */
async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshtoken }),
    });

    if (!res.ok) throw new Error("Falha ao renovar token");

    const json = await res.json();
    const data = json.data;

    return {
      ...token,
      accesstoken: data.accesstoken,
      refreshtoken: data.refreshtoken ?? token.refreshtoken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // ✅ 1 hora
    };
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        matricula: { label: "Matricula", type: "text" },
        senha: { label: "Senha", type: "password" },
        manterLogado: { label: "Manter Logado", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.matricula || !credentials?.senha) return null;

        const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matricula: credentials.matricula,
            senha: credentials.senha,
          }),
        });

        if (!res.ok) return null;

        const json = await res.json();

        if (json && json.usuario && json.usuario.id) {
          return {
            id: json.usuario.id,
            nome_usuario: json.usuario.nome_usuario ?? "",
            email: json.usuario.email ?? "",
            matricula: json.usuario.matricula ?? "",
            perfil: json.usuario.perfil ?? "",
            accesstoken: json.accessToken ?? "",
            refreshtoken: json.refreshToken ?? "",
            manterLogado: credentials.manterLogado === "true",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 1️⃣ Primeiro login
      if (user) {
        const manterLogado = (user as any).manterLogado;
        
        return {
          ...token,
          ...user,
          manterLogado,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hora
        };
      }

      // 2️⃣ Token ainda válido
      if (Date.now() < Number(token.accessTokenExpires ?? 0)) {
        return token;
      }

      // 3️⃣ Token expirou → tenta renovar
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user = { ...session.user, ...token };
      }

      // Se o refresh falhou, forçar logout no cliente
      if (token?.error === "RefreshAccessTokenError" && typeof window !== "undefined") {
        window.location.href = "/logout";
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
