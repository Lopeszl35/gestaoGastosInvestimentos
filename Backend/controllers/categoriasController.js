import { validationResult } from 'express-validator';

class CategoriasController {
    constructor(CategoriasModel, TransactionUtil) {
        this.CategoriasModel = CategoriasModel;
        this.TransactionUtil = TransactionUtil;
    }

    async createCategoria(req, res) {
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
}

export default CategoriasController;