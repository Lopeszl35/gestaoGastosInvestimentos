import { API_URL } from "../constants/ApiUrl";
import { storeTokenSecure, removeTokenSecure } from "../utils/tokenStorage";
import { UserCadastro } from "../interfaces/userInterface";

export const registerUser = async (user: UserCadastro): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user: user}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao cadastrar usuário.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Erro ao cadastrar usuário.");
  }
};

export const loginUser = async (email: string, senha: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/loginUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login.");
    }
      // Para mobile (React Native)
      await storeTokenSecure(data.token);

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
      // Remover token no dispositivo móvel
      await removeTokenSecure();
    console.log("Usuário deslogado com sucesso.");
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error.message);
    throw error;
  }
};


export const atualizarUserSaldo = async (saldo: number, userId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/userSaldo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ saldo, userId }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar saldo do usuário.");
    }

    return data;

  } catch (error) {
    throw new Error((error as Error).message || "Erro ao atualizar saldo do usuário.");
  }
}


export const getUserData = async (userId: number): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/userData/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao obter dados do usuário.");
      }

      return data;
    } catch (error) {
      throw new Error((error as Error).message || "Erro ao obter dados do usuário.");
    }
  };