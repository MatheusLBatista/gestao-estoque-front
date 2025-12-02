"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserProfileContextType {
  fotoPerfil: string | null;
  atualizarFotoPerfil: (novaFoto: string) => void;
  carregarFotoPerfil: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  
  const usuario = session?.user;
  const matricula = usuario?.matricula || "";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const carregarFotoPerfil = async () => {
    if (!matricula || !usuario?.accesstoken) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${matricula}`, {
        headers: {
          Authorization: `Bearer ${usuario.accesstoken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.foto_perfil) {
          const fotoUrl = `${API_URL}${result.data.foto_perfil}`;
          setFotoPerfil(fotoUrl);
          // Salvar no localStorage para persistência
          localStorage.setItem(`foto_perfil_${matricula}`, fotoUrl);
        } else {
          // Se não houver foto, remover do localStorage
          localStorage.removeItem(`foto_perfil_${matricula}`);
          setFotoPerfil(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar foto de perfil:", error);
    }
  };

  const atualizarFotoPerfil = (novaFoto: string) => {
    setFotoPerfil(novaFoto);
    if (matricula) {
      localStorage.setItem(`foto_perfil_${matricula}`, novaFoto);
    }
  };

  // Carregar foto ao montar o componente
  useEffect(() => {
    if (matricula) {
      // Primeiro, tenta carregar do localStorage
      const fotoCache = localStorage.getItem(`foto_perfil_${matricula}`);
      if (fotoCache) {
        setFotoPerfil(fotoCache);
      }
      // Depois busca do servidor
      carregarFotoPerfil();
    }
  }, [matricula, usuario?.accesstoken]);

  return (
    <UserProfileContext.Provider value={{ fotoPerfil, atualizarFotoPerfil, carregarFotoPerfil }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile deve ser usado dentro de um UserProfileProvider");
  }
  return context;
}
