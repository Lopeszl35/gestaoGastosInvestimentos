import { API_URL } from "../constants/ApiUrl";

export interface User {
  nome: string;
  email: string;
  senha_hash: string;
  perfil_financeiro: string;
  salario_mensal: number;
  saldo_inicial: number;
  saldo_atual: number;
}

export const registerUser = async (user: User): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao cadastrar usuário.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Erro ao conectar ao servidor.");
  }
};
