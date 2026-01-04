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


export const getLimiteGastoMes = async (id_usuario: number, ano: number, mes: number): Promise<any> => {
    try {
        const responde = await fetchWithToken(`getLimiteGastoMes/?id_usuario=${id_usuario}&ano=${ano}&mes=${mes}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(!responde.ok) {
            const ErrorData = await responde.json();
            console.error("Console Error:", ErrorData);
            throw new Error(ErrorData.message || "Erro ao adicionar limite de gastos no mês.");
        }

        const data = await responde.json();
        return data[0];
    } catch (error: any) {
        console.error("Erro em service configLimiteGastoMes:", error.message);
        throw new Error(error || "Erro ao adicionar limite de gastos no mês.");
    }
}