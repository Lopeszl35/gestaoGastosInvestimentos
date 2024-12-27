import { API_URL } from "../constants/ApiUrl";
import { getTokenSecure } from "../utils/tokenStorage";

export const fetchWithToken = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const token = await getTokenSecure();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    console.error("Erro ao fazer requisição com token:", error);
    throw error;
  }
};
