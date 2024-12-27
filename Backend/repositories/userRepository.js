import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserRepository {
    constructor(Database) {
        this.Database = Database;
    }

    /**
     * Cria um usuário no banco de dados.
     * @param {Object} user - Dados do usuário a serem salvos.
     * @param {Object} connection - Conexão do banco de dados.
     * @returns {Object} Resultado da inserção.
     */
    async createUser(user, connection) {
        const sql = `
            INSERT INTO Usuarios (nome, email, senha_hash, perfil_financeiro, salario_mensal, saldo_inicial, saldo_atual)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const params = [
            user.nome,
            user.email,
            user.senha_hash,
            user.perfil_financeiro,
            user.salario_mensal,
            user.saldo_inicial,
            user.saldo_atual,
        ];
        try {
            const [result] = await connection.query(sql, params);
            return { insertId: result.insertId, result: result };
        } catch (error) {
            console.error("Erro no UserRepository.createUser:", error.message);
            throw error;
        }
    }

    /**
     * Verifica as credenciais do usuário e retorna os dados do usuário.
     * @param {string} email - E-mail do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Object} Dados do usuário e token JWT.
     */
    async loginUser(email, password) {
        const sql = `
            SELECT * FROM Usuarios
            WHERE email = ?;
        `;
        try {
            const result = await this.Database.executaComando(sql, [email]);
            if (result.length === 0) {
                throw new Error("Nenhum usuário encontrado com este e-mail.");
            }

            const user = result[0];

            // Verifica se a senha é válida
            const senhaValida = await bcrypt.compare(password, user.senha_hash);
            if (!senhaValida) {
                throw new Error("Senha inválida.");
            }

            // Gera um token JWT
            const token = jwt.sign(
                { id: user.id_usuario, email: user.email },
                process.env.JWT_SECRET, // Segredo do JWT
                { expiresIn: "1d" } // Expira em 1 dia
            );

            return {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email,
                perfil_financeiro: user.perfil_financeiro,
                salario_mensal: user.salario_mensal,
                saldo_atual: user.saldo_atual,
                token,
            };
        } catch (error) {
            console.error("Erro no UserRepository.loginUser:", error.message);
            throw error;
        }
    }
}

export default UserRepository;
