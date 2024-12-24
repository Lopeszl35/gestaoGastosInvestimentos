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

        const { nome, email, password, perfil_financeiro, salario_mensal, saldo_inicial, saldo_atual } = req.body;

        try {
            // Validação do e-mail e senha
            const isValid = await this.UserModel.isValidUser(email, password);
            if (!isValid) {
                return res.status(400).json({ message: "E-mail ou senha inválidos: " + isValid });
            }

            // Executa a lógica dentro de uma transação
            const response = await this.TransactionUtil.executeTransaction(async (connection) => {
                const user = {
                    nome: nome,
                    email: email,
                    senha_hash: password,
                    perfil_financeiro: perfil_financeiro,
                    salario_mensal: salario_mensal,
                    saldo_inicial: saldo_inicial,
                    saldo_atual: saldo_atual,
                };

                return await this.UserModel.createUser(user, connection);
            });

            res.status(200).json(response);
        } catch (error) {
            console.error('Erro ao criar o usuário:', error.message);
            res.status(400).json({ message: "Erro ao criar o usuário: " + error.message });
        }
    }
}

export default UserController;
