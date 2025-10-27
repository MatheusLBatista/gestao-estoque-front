import NextAuth from "next-auth";

declare module "next-auth" {

	interface Session {
		user: {
			id: string;
			nome_usuario: string;
			email: string;
			matricula: string;
			perfil: string;
			ativo: boolean;
			senha_definida: boolean;
			online: boolean;
			grupos: string[];
			permissoes: string[];
			data_cadastro: string;
			data_ultima_atualizacao: string;
			accesstoken: string;
			refreshtoken: string;
		};
	}

	interface User {
		id: string;
		nome_usuario: string;
		email: string;
		matricula: string;
		perfil: string;
		ativo: boolean;
		senha_definida: boolean;
		online: boolean;
		grupos: string[];
		permissoes: string[];
		data_cadastro: string;
		data_ultima_atualizacao: string;
		accesstoken: string;
		refreshtoken: string;
	}

}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		nome_usuario: string;
		email: string;
		matricula: string;
		perfil: string;
		ativo: boolean;
		senha_definida: boolean;
		online: boolean;
		grupos: string[];
		permissoes: string[];
		data_cadastro: string;
		data_ultima_atualizacao: string;
		accesstoken: string;
		refreshtoken: string;
	}
}
