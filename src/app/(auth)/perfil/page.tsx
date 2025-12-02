"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";

export default function PerfilPage() {
  const { data: session } = useSession();
  const { fotoPerfil, atualizarFotoPerfil } = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, UpandoFoto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "José Silva",
    email: "jose.silva@gmail.com",
    telefone: "(69) 992222-2222",
  });

  // Obter dados do usuário logado
  const usuario = session?.user;
  const matricula = usuario?.matricula || "";
  const nomeUsuario = usuario?.nome_usuario || "Usuário";
  const emailUsuario = usuario?.email || "";
  const perfilUsuario = usuario?.perfil || "";

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(false);
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const TiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!TiposPermitidos.includes(file.type)) {
      alert("Formato de arquivo não suportado. Use apenas: JPEG, PNG, GIF ou WEBP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 5MB");
      return;
    }

    try {
      UpandoFoto(true);

      const formData = new FormData();
      formData.append('foto', file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/usuarios/${matricula}/foto-perfil`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usuario?.accesstoken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao fazer upload da foto');
      }

      // Atualiza a foto no contexto global
      const novaFotoUrl = `${API_URL}${result.data.foto_perfil}`;
      console.log('Nova URL da foto:', novaFotoUrl);
      console.log('Dados retornados:', result.data);
      
      atualizarFotoPerfil(novaFotoUrl);

      alert("Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert(error.message || "Erro ao fazer upload da foto");
    } finally {
      UpandoFoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-8">
        <div className="max-w-7xl w-full">
          <div className="bg-[#0344DA]/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <div className="flex gap-12">
              <div className="w-1/3 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <Avatar className="h-48 w-48 border-4 border-white/20 shadow-2xl">
                      <AvatarImage 
                        src={fotoPerfil || "/foto-perfil.jpeg"} 
                        alt="User Avatar" 
                      />
                      <AvatarFallback className="text-5xl bg-blue-700 text-white">
                        {nomeUsuario.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h2 className="text-3xl font-bold text-white text-center">
                    {nomeUsuario}
                  </h2>

                  {/* User Role */}
                  <p className="text-lg text-white/90 font-medium">
                    {perfilUsuario.charAt(0).toUpperCase() + perfilUsuario.slice(1)}
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <Button
                    onClick={handlePhotoButtonClick}
                    disabled={isUploadingPhoto}
                    variant="outline"
                    className="mt-4 bg-blue-800/50 hover:bg-blue-700/60 text-white border-white/30 hover:border-white/50 px-8 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingPhoto ? "Enviando..." : "Alterar foto"}
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white text-center mb-12">
                  Informações da conta
                </h1>

                <div className="space-y-8">
                  <div>
                    <label htmlFor="nome" className="block text-white text-lg font-medium mb-3">
                      Nome
                    </label>
                    <Input
                      id="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="José Silva"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white text-lg font-medium mb-3">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="jose.silva@gmail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-white text-lg font-medium mb-3">
                      Telefone
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/90 text-gray-800 border-0 rounded-xl h-14 text-base px-6 placeholder:text-gray-400 disabled:opacity-90 disabled:cursor-default"
                      placeholder="(69) 992222-2222"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-12">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="bg-blue-900/60 hover:bg-blue-800/70 text-white border-white/30 hover:border-white/50 px-10 py-3 rounded-xl text-base font-medium transition-all"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl text-base font-medium shadow-lg transition-all"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
