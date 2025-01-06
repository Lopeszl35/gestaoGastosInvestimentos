import ErroSqlHandler from "../../../utils/ErroSqlHandler.js";

export default class CategoriasModel {
    constructor(CategoriasRepoitory) {
        this.CategoriasRepoitory = CategoriasRepoitory;
    }

    async createCategoria(categoria, connection) {
        try {
            const result = await this.CategoriasRepoitory.createCategoria(categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao criar categoria no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'categoria');
            throw error;
        }
    }

    async getCategorias(id_usuario) {
        try {
            const result = await this.CategoriasRepoitory.getCategorias(id_usuario);
            return result;
        } catch (error) {
            console.log("Erro ao buscar categorias no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'categoria');
            throw error;
        }
    }

    async updateCategoria(id_categoria, categoria, connection) {
        try {
            const result = await this.CategoriasRepoitory.updateCategoria(id_categoria, categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao atualizar categoria no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'categoria');
            throw error;
        }
    }

    async deleteCategoria(id_categoria, connection) {
        try {
            const result = await this.CategoriasRepoitory.deleteCategoria(id_categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao deletar categoria no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'categoria');
            throw error;
        }
    }

    async addGasto(gastos, id_usuario, connection) {
        try {
            const result = await this.CategoriasRepoitory.addGasto(gastos, id_usuario, connection);
            return result;
        } catch (error) {
            console.log("Erro ao adicionar gasto no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'categoria');
            throw error;
        }
    }
}