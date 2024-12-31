import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web"; // Usar Platform.OS para garantir a verificação correta

export const storeTokenSecure = async (token: string): Promise<void> => {
  if (isWeb) {
    // Usar localStorage no navegador
    localStorage.setItem("token", token);
  } else {
    // Usar SecureStore no mobile
    await SecureStore.setItemAsync("token", token);
  }
};

export const getTokenSecure = async (): Promise<string | null> => {
  if (isWeb) {
    // Recuperar do localStorage no navegador
    return localStorage.getItem("token");
  } else {
    // Recuperar do SecureStore no mobile
    return await SecureStore.getItemAsync("token");
  }
};

export const removeTokenSecure = async (): Promise<void> => {
  if (isWeb) {
    // Remover do localStorage no navegador
    localStorage.removeItem("token");
  } else {
    // Remover do SecureStore no mobile
    await SecureStore.deleteItemAsync("token");
  }
};
