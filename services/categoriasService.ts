import { User } from "@/context/UserContext";
import { fetchWithToken } from "./apiService";

export const getCategorias = async (id_usuario?: number): Promise<any> => {
    let endpoint = `getCategorias?id_usuario=${id_usuario}`;
    if (!id_usuario) {
        endpoint = `getCategorias`;
    }
    try {
        const response = await fetchWithToken(`${endpoint}`, {
            method: "GET",
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao buscar categorias.");
        }

        const data = await response.json();
        return data; // Retorna os dados processados
    } catch (error: any) {
        console.error("Erro ao buscar categorias:", error.message);
        throw new Error(error.message || "Erro ao buscar categorias.");
    }
};
