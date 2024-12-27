import { getTokenSecure } from "./tokenStorage";

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getTokenSecure();
  return !!token; // Retorna true se o token existir, caso contrário, false
};
