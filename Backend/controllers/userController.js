import { validationResult } from 'express-validator';

class UserController {
    constructor(UserModel, TransactionUtil) {
        this.UserModel = UserModel;
        this.TransactionUtil = TransactionUtil;
    }

    async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.body;
        console.log("user recebido no controller: ", user);

        try {
            // Validação do e-mail e senha
            const isValid = await this.UserModel.isValidUser(user.email, user.senha_hash);
            if (!isValid) {
                return res.status(400).json({ message: "E-mail ou senha inválidos: " + isValid });
            }

            // Executa a lógica dentro de uma transação
            const response = await this.TransactionUtil.executeTransaction(async (connection) => {
                const userModelo = {
                    nome: user.nome,
                    email: user.email,
                    senha_hash: user.senha_hash,
                    perfil_financeiro: user.perfil_financeiro,
                    salario_mensal: user.salario_mensal,
                    saldo_inicial: user.saldo_inicial,
                    saldo_atual: user.saldo_atual,
                };

                return await this.UserModel.createUser(userModelo, connection);
            });

            res.status(200).json(response);
        } catch (error) {
            console.error('Erro ao criar o usuário:', error.message);
            res.status(400).json({ message: "Erro ao criar o usuário: " + error.message });
        }
    }
}

export default UserController;
