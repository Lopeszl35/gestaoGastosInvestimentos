import { API_URL } from "../constants/ApiUrl";
import { getTokenSecure } from "../utils/tokenStorage";

function timeoutPromise(ms: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT")), ms);
  });
}

export const fetchWithToken = async (
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = 12000
): Promise<Response> => {
  try {
    const token = await getTokenSecure();

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const baseHeaders: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchPromise = fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
    });

    const response = await Promise.race([
      fetchPromise,
      timeoutPromise(timeoutMs),
    ]);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text().catch(() => "");
      throw new Error(
        text
          ? `Resposta inesperada do servidor: ${text}`
          : "Resposta inesperada do servidor (não JSON)."
      );
    }

    return response;
  } catch (error: any) {
    if (error?.message === "TIMEOUT") {
      throw new Error(
        "Tempo limite excedido. O servidor não respondeu (timeout)."
      );
    }
    throw error;
  }
};
