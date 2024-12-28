import * as SecureStore from "expo-secure-store";


export const storeTokenSecure = async (token: string): Promise<void> => {
  try {
      await SecureStore.setItemAsync("userToken", token);
  } catch (error) {
    console.error("Erro ao armazenar o token de forma segura:", error);
  }
};

export const getTokenSecure = async (): Promise<string | null> => {
  try {
      return await SecureStore.getItemAsync("userToken");
  } catch (error) {
    console.error("Erro ao recuperar o token de forma segura:", error);
    return null;
  }
};

export const removeTokenSecure = async (): Promise<void> => {
  try {
      await SecureStore.deleteItemAsync("userToken");
  } catch (error) {
    console.error("Erro ao remover o token de forma segura:", error);
  }
};
