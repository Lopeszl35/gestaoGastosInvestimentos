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

export const createCategoria =async (categoria: any): Promise<any> => {
    try {
        const response = await fetchWithToken(`createCategorias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoria),
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao criar categoria.");
        }

        const data = await response.json();
        return data; // Retorna os dados processados
    } catch (error: any) {
        console.error("Erro ao criar categoria:", error.message);
        throw new Error(error.message || "Erro ao criar categoria.");
    }
}

export const deleteCategoria =  async (id_categoria: number): Promise<any> => {
    try {
        const response = await fetchWithToken(`deleteCategorias?id_categoria=${id_categoria}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao excluir categoria.");
        }

        const data = await response.json();
        console.log("data: ", data);
        return data; // Retorna os dados processados
    } catch (error: any) {
        console.error("Erro ao excluir categoria:", error.message);
        throw new Error(error.message || "Erro ao excluir categoria.");
    }
}

export const addGasto =  async (gastos: any, id_usuario: number): Promise<any> => {
    try {
        const response = await fetchWithToken(`addGasto?id_usuario=${id_usuario}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gastos),
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao adicionar gasto.");
        }

        const data = await response.json();
        return data; // Retorna os dados processados
    } catch (error: any) {
        console.error("Erro ao adicionar gasto:", error.message);
        throw new Error(error.message || "Erro ao adicionar gasto.");
    }
}

export const updateCategoria =  async (categoria: any, id_categoria: number): Promise<any> => {
    try {
        const response = await fetchWithToken(`updateCategoria?id_categoria=${id_categoria}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoria),
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.message || "Erro ao atualizar categoria.");
        }

        const data = await response.json();
        return data; // Retorna os dados processados
    } catch (error: any) {
        console.error("Erro ao atualizar categoria:", error.message);
        throw new Error(error.message || "Erro ao atualizar categoria.");
    }
}