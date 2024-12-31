import { API_URL } from "../constants/ApiUrl";
import { getTokenSecure } from "../utils/tokenStorage";

export const fetchWithToken = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const token = await getTokenSecure();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response;
    } else {
      const text = await response.text();
      console.error("Resposta não JSON recebida:", text);
      throw new Error("Resposta inesperada do servidor.");
    }
  } catch (error) {
    console.error("Erro ao fazer requisição com token:", error);
    throw error;
  }
};
