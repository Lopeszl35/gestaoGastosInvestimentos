import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ErroSqlHandler from '../../../utils/ErroSqlHandler.js';

class UserModel {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    async isValidUser(email, password) {
        if(!email) {
            throw new Error('E-mail obrigatório.');
        } else if(!password) {
            throw new Error('Senha obrigatória.');
        }
        try {
            // Validação do e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para e-mail válido
            if (!emailRegex.test(email)) {
                throw new Error('E-mail inválido.');
            }

            // Validação da senha
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                throw new Error(
                    'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
                );
            }

            // Se ambos forem válidos, retorna true
            return true;
        } catch (error) {
            console.log('Erro na validação do usuário:', error.message);
            throw error;
        }
    }

    async createUser(user, connection) {
        try {
            const salt = bycrypt.genSaltSync(10);
            const passwordhash = bycrypt.hashSync(user.senha_hash, salt);

            user.senha_hash = passwordhash;

            // Chama o repositório para criar o usuário
            const response = await this.UserRepository.createUser(user, connection);
            if(!response.insertId) {
                throw new Error('Erro ao criar o usuário: ' + response);
            }
            return response;
        } catch (error) {
            console.log('Erro ao criar o usuário:', error.message);
            ErroSqlHandler.tratarErroDuplicado(error, 'usuario');
            throw error;
        }
    }

}

export default UserModel;
