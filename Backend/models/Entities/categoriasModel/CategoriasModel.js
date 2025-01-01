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
}