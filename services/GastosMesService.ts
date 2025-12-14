import { fetchWithToken } from "./apiService";


export const configLimiteGastoMes = async (id_usuario: number, dadosMes: any): Promise<any> => {
    try {
        const response = await fetchWithToken(`configGastoLimiteMes/${id_usuario}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({dadosMes}),
        });
        if(!response.ok) {
            const ErrorData = await response.json();
            console.error("Console Error:", ErrorData);
            throw new Error(ErrorData.message || "Erro ao adicionar limite de gastos no mês.");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Erro em service configLimiteGastoMes:", error.message);
        throw new Error(error || "Erro ao adicionar limite de gastos no mês.");
    }
}