import * as SecureStore from "expo-secure-store";

const isWeb = typeof window !== "undefined";

export const storeTokenSecure = async (token: string): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.setItem("userToken", token); // Fallback no navegador
    } else {
      await SecureStore.setItemAsync("userToken", token);
    }
  } catch (error) {
    console.error("Erro ao armazenar o token de forma segura:", error);
  }
};

export const getTokenSecure = async (): Promise<string | null> => {
  try {
    if (isWeb) {
      return localStorage.getItem("userToken"); // Fallback no navegador
    } else {
      return await SecureStore.getItemAsync("userToken");
    }
  } catch (error) {
    console.error("Erro ao recuperar o token de forma segura:", error);
    return null;
  }
};

export const removeTokenSecure = async (): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.removeItem("userToken"); // Fallback no navegador
    } else {
      await SecureStore.deleteItemAsync("userToken");
    }
  } catch (error) {
    console.error("Erro ao remover o token de forma segura:", error);
  }
};
