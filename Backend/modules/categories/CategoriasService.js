import RequisicaoIncorreta from "../../errors/RequisicaoIncorreta.js";
import { normalizarNomeCategoria } from "./categoriasValidade.js";
export default class CategoriasService {
    constructor(CategoriasRepoitory) {
        this.CategoriasRepoitory = CategoriasRepoitory;
    }

    async createCategoria(categoria, id_usuario, connection) {
        console.log("CategoriasService.createCategoria chamado com:", { categoria, id_usuario });
        try {
            const nomeNormalizado = normalizarNomeCategoria(categoria.nome);
            console.log("nomeNormalizado: ", nomeNormalizado);
            const categoriaExists = await this.CategoriasRepoitory.checkCategoriaExists(nomeNormalizado, id_usuario, connection);

            if (categoriaExists) {
                throw new RequisicaoIncorreta(`A categoria com nome '${categoria.nome}' já existe para este usuário.`);
            }
            const result = await this.CategoriasRepoitory.createCategoria({ ...categoria, nome: nomeNormalizado }, id_usuario, connection);
            return result;
        } catch (error) {
            console.log("Erro ao criar categoria no Service:", error.message);
            throw error;
        }
    }

    async getCategorias(id_usuario) {
        try {
            const result = await this.CategoriasRepoitory.getCategorias(id_usuario);
            return result;
        } catch (error) {
            console.log("Erro ao buscar categorias no modelo:", error.message);
            throw error;
        }
    }

    async updateCategoria(id_categoria, categoria, connection) {
        try {
            const result = await this.CategoriasRepoitory.updateCategoria(id_categoria, categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao atualizar categoria no modelo:", error.message);
            throw error;
        }
    }

    async deleteCategoria(id_categoria, connection) {
        try {
            const result = await this.CategoriasRepoitory.deleteCategoria(id_categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao deletar categoria no modelo:", error.message);
            throw error;
        }
    }

}