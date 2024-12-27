import { API_URL } from "../constants/ApiUrl";
import { storeTokenSecure, removeTokenSecure } from "../utils/tokenStorage";
import { User } from "../interfaces/userInterface";



export const registerUser = async (user: User): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/loginUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login.");
    }

    //Armazena o token no dispositivo
    await storeTokenSecure(data.token);

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Remove o token ao fazer logout
    await removeTokenSecure();
    console.log("Usuário deslogado com sucesso.");
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error.message);
    throw error;
  }
};
