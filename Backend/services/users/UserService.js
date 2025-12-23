import ErroSqlHandler from '../../errors/ErroSqlHandler.js';
import NaoEncontrado from '../../errors/naoEncontrado.js';
import { generateToken } from '../../auth/token.js';
import Auth from '../../auth/auth.js';
import AuthResponseDTO from '../../models/Entities/UserMoldels/AuthResponseDTO.js';

class UserService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
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
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = await this.UserRepository.getUserByEmail(email);

            if (!user) {
                throw new NaoEncontrado('Usuário nao encontrado');
            } else {
                await Auth.senhaValida(password, user.senha_hash);            
                const token = generateToken(user);
                return new AuthResponseDTO(user, token);
            }
        } catch (error) {
            console.log("Erro ao logar o usuário no modelo:", error.message);
            throw error;
        }
    }

    async getUserSaldo(userId) {
        try {
            const saldo = await this.UserRepository.getUserSaldo(userId);
            return saldo;
        } catch (error) {
            console.log("Erro ao obter o saldo do usuário no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'usuario');
            throw error;
        }
    }

    async atualizarUserSaldo(userId, novoSaldo,) {
        try {
            const novoSaldoAtualizado = await this.UserRepository.atualizarUserSaldo(userId, novoSaldo);
            return novoSaldoAtualizado;
        } catch (error) {
            console.log("Erro ao atualizar o saldo do usuário no modelo:", error.message);
            ErroSqlHandler.tratarErroSql(error, 'usuario');
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const userData = await this.UserRepository.getUser(userId);
            return userData;
        } catch (error) {
            console.log("Erro ao obter os dados do usuário no modelo:", error.message);
            throw error;
        }
    }

}

export default UserService;
