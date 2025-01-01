

export default class CategoriasRepository {
    constructor(database) {
        this.database = database;
    }

    async createCategoria(categoria) {
        const sql = `
            INSERT INTO categorias_gastos (id_usuario, nome, limite, total_gastos) VALUES (?, ?, ?, ?);
        `
        params = [categoria.id_usuario, categoria.nome, categoria.limite, categoria.total_gastos];
        try {
            const result = await this.database.executaComandoNonQuery(sql, params);
            return result;
        } catch (error) {
            console.error("Erro no CategoriasRepository.createCategoria:", error.message);
            throw error;
        }
    }

    async getCategorias(id_usuario) {
        let sql = `
        SELECT 
            id_categoria,
            id_usuario,
            nome,
            CAST(limite AS DECIMAL(10, 2)) AS limite,
            CAST(total_gastos AS DECIMAL(10, 2)) AS total
        FROM categorias_gastos;
        `;
        const params = [];
    
        console.log("id_usuario recebido: ", id_usuario);
    
        // Verifica se id_usuario é um número válido
        if (typeof id_usuario === 'number' && id_usuario > 0) {
            sql += ' WHERE id_usuario = ?';
            params.push(id_usuario);
        }
    
        console.log("SQL executado: ", sql, "com parâmetros:", params);
    
        try {
            const result = await this.database.executaComando(sql, params);
            console.log("result: ", result);
            return result;
        } catch (error) {
            console.error("Erro no CategoriasRepository.getCategorias:", error.message);
            throw error;
        }
    }
    
    
}