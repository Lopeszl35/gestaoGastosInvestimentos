import RequisicaoIncorreta from "../../errors/RequisicaoIncorreta.js";
import ErroBase from "../../errors/Errobase.js";
import { normalizarNomeCategoria } from "./categoriasValidade.js";
export default class CategoriasService {
     constructor(CategoriasRepository) {
        this.CategoriasRepository = CategoriasRepository;
    }

    async createCategoria(categoria, id_usuario, connection) {
        console.log("CategoriasService.createCategoria chamado com:", { categoria, id_usuario });
        try {
            const nomeNormalizado = normalizarNomeCategoria(categoria.nome);
            console.log("nomeNormalizado: ", nomeNormalizado);
            const categoriaExists = await this.CategoriasRepository.checkCategoriaExists(nomeNormalizado, id_usuario, connection);

            if (categoriaExists) {
                throw new RequisicaoIncorreta(`A categoria com nome '${categoria.nome}' já existe para este usuário.`);
            }
            const result = await this.CategoriasRepository.createCategoria({ ...categoria, nome: nomeNormalizado }, id_usuario, connection);
            return result;
        } catch (error) {
            console.log("Erro ao criar categoria no Service:", error.message);
            throw error;
        }
    }

    async getCategoriasAtivas(id_usuario) {
        try {
            const result = await this.CategoriasRepository.getCategoriasAtivas(id_usuario);
            return result;
        } catch (error) {
            console.log("Erro ao buscar categorias no service:", error.message);
            throw error;
        }
    }

    async updateCategoria(id_categoria, categoria, connection) {
        try {
            const result = await this.CategoriasRepository.updateCategoria(id_categoria, categoria, connection);
            return result;
        } catch (error) {
            console.log("Erro ao atualizar categoria no service:", error.message);
            throw error;
        }
    }

    async deleteCategoria(id_categoria, dataAtual, connection) {
        try {
            const result = await this.CategoriasRepository.deleteCategoria(id_categoria, dataAtual, connection);
            return result;
        } catch (error) {
            console.log("Erro ao deletar categoria no service:", error.message);
            throw error;
        }
    }

    async getCategoriasInativas(id_usuario) {
        try {
            const result = await this.CategoriasRepository.getCategoriasInativas(id_usuario);
            return result;
        } catch (error) {
            console.log("Erro ao buscar categorias inativas no service:", error.message);
            throw error;
        }
    }

    async reativarCategoria(id_categoria, id_usuario, connection) {
        try {
            const result = await this.CategoriasRepository.reativarCategoria(id_categoria, id_usuario, connection);
            return result;
        } catch (error) {
            console.log("Erro ao reativar categoria no service:", error.message);
            throw error;
        }
    }

}