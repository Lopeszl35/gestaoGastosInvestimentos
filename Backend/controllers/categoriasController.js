import { validationResult } from 'express-validator';
import validarEntradaGastos from '../models/Entities/categoriasModel/validarEntradaGastos.js';

class CategoriasController {
    constructor(CategoriasModel, TransactionUtil) {
        this.CategoriasModel = CategoriasModel;
        this.TransactionUtil = TransactionUtil;
    }

    async createCategorias(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            // Destruturando categoria
            const categoria = req.body;
            // Verificando se os campos 'limite' e 'nome' foram preenchidos
            if(!categoria.limite || !categoria.nome) {
                return res.status(400).json({ message: "Os campos 'limite' e 'nome' devem ser preenchidos."});
            }
            const result = await this.TransactionUtil.executeTransaction(async (connection) => {
                return await this.CategoriasModel.createCategoria(categoria, connection);
            })
            res.status(201).json(result);
        } catch (error) {
            console.error('Erro ao criar categoria:', error.message);
            res.status(400).json({ message: "Erro ao criar categoria: " + error.message});
        }
    }

    async updateCategoria(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const { id_categoria } = req.query;
        const categoria = req.body;
        if(!id_categoria) {
            return res.status(400).json({ message: "Id da categoria não informado."});
        }

        try {
            const result = await this.TransactionUtil.executeTransaction(async (connection) => {
                return await this.CategoriasModel.updateCategoria(id_categoria, categoria, connection);
            })
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error.message);
            res.status(400).json({ message: "Erro ao atualizar categoria: " + error.message});
        }
    }

    async deleteCategoria(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const { id_categoria } = req.query;
        if(!id_categoria) {
            return res.status(400).json({ message: "Id da categoria não informado."});
        }
        try {
            const result = await this.TransactionUtil.executeTransaction(async (connection) => {
                return await this.CategoriasModel.deleteCategoria(id_categoria, connection);
            })
            console.log("result: ", result);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: "Erro ao deletar categoria: " + error.message});
        }
    }

    async getCategorias(req, res) {
        const errors = validationResult(req);
        const id_usuario = req.query;
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            const result = await this.CategoriasModel.getCategorias(id_usuario);
            res.status(200).json(result);
        } catch (error) {
            console.log('Erro ao buscar categorias:', error.message);
            res.status(400).json({ message: "Erro ao buscar categorias: " + error.message});
        }
    }

    async addGasto(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        
        const gastos = req.body;
        const { id_usuario } = req.query;
       
        if(!id_usuario) {
            return res.status(400).json({ message: "Id de usuário não informado."});
        }
        // Validar os campos obrigatórios usando a função validarEntradaGastos
        const validacao = validarEntradaGastos(gastos);
        if (validacao !== true) {
            return res.status(400).json({ errors: validacao });
        }

        try {
            const result = await this.TransactionUtil.executeTransaction(async (connection) => {
                return await this.CategoriasModel.addGasto(gastos, id_usuario, connection);
            })
            res.status(200).json(result);
        } catch (error) {
            console.error("Erro ao adicionar gasto no modelo:", error.message);
            res.status(400).json({ message: "Erro ao adicionar gasto: " + error.message });
        }
    }

}

export default CategoriasController;