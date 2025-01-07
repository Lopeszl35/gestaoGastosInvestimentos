import { fetchWithToken } from "./apiService";


export const configLimiteGastoMes = async (id_usuario: number, dataMes: any): Promise<any> => {
    try {
        const response = await fetchWithToken(`configGastoLimiteMes?id_usuario=${id_usuario}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({dataMes}),
        });
        if(!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao adicionar limite de gastos no mês.");
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Erro ao adicionar limite de gastos no mês:", error.message);
        throw new Error(error.message || "Erro ao adicionar limite de gastos no mês.");
    }
}