import { fetchWithToken } from "./apiService";

export const getCategorias = async (): Promise<any> => {
    try {
        const response = await fetchWithToken("getCategorias", {
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
