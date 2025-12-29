import ErroSqlHandler from '../../errors/ErroSqlHandler.js';
import NaoEncontrado from '../../errors/naoEncontrado.js';
import { generateToken } from '../../auth/token.js';
import Auth from '../../auth/auth.js';
import AuthResponseDTO from './AuthResponseDTO.js';
import { hashPassword } from '../../auth/passwordHash.js';

class UserService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    async createUser(user) {
        try {
            // Hash da senha antes de salvar
            user.senha_hash = await hashPassword(user.senha_hash);
            // Chama o repositório para criar o usuário
            const response = await this.UserRepository.createUser(user);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.UserRepository.deleteUser(userId);
            return result;
        } catch (error) {
            throw error;
        }
    }

     async atualizarUsuario(userId, updatesDto) {
        // whitelist total (regra de negócio aqui)
        const payload = {};

        if (updatesDto.nome !== undefined) payload.nome = updatesDto.nome;
        if (updatesDto.email !== undefined) payload.email = updatesDto.email;
        if (updatesDto.perfil_financeiro !== undefined) payload.perfil_financeiro = updatesDto.perfil_financeiro;
        if (updatesDto.salario_mensal !== undefined) payload.salario_mensal = updatesDto.salario_mensal;

        if (updatesDto.senha !== undefined) {
            payload.senha_hash = await hashPassword(updatesDto.senha);
        }

        // nada pra atualizar
        if (Object.keys(payload).length === 0) {
            return { affectedRows: 0, message: "Nenhum campo para atualizar." };
        }

        return this.UserRepository.atualizarUsuario(userId, payload);
    }


    async loginUser(email, senha) {
        try {
            const user = await this.UserRepository.getUserByEmail(email);
            if (!user) {
                throw new NaoEncontrado('Usuário nao encontrado');
            } else {
                await Auth.senhaValida(senha, user.senha_hash);            
                const token = generateToken(user);
                return new AuthResponseDTO(user, token);
            }
        } catch (error) {
            console.log("Erro ao logar o usuário no service:", error.message);
            throw error;
        }
    }

    async getUserSaldo(userId) {
        try {
            const saldo = await this.UserRepository.getUserSaldo(userId);
            return saldo;
        } catch (error) {
            console.log("Erro ao obter o saldo do usuário no modelo:", error.message);
            throw error;
        }
    }

    async atualizarUserSaldo(userId, novoSaldo,) {
        try {
            const novoSaldoAtualizado = await this.UserRepository.atualizarUserSaldo(userId, novoSaldo);
            return novoSaldoAtualizado;
        } catch (error) {
            console.log("Erro ao atualizar o saldo do usuário no modelo:", error.message);
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

    async getUserData(userId) {
        try {
            const userData = await this.UserRepository.getUserById(userId);
            return userData;
        } catch (error) {
            console.log("Erro ao obter os dados do usuário no modelo:", error.message);
            throw error;
        }
    }

}

export default UserService;
