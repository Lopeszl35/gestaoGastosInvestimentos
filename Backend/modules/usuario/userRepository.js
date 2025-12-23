import ErroSqlHandler from '../../errors/ErroSqlHandler.js';

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
            ErroSqlHandler.tratarErroSql(error);
        }
    }

    /**
     * Verifica as credenciais do usuário e retorna os dados do usuário.
     * @param {string} email - E-mail do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Object} Dados do usuário e token JWT.
     */
    async getUserSaldo(userId) {
        const sql = `
            SELECT saldo_atual FROM Usuarios
            WHERE id_usuario = ?;
        `;

        try {
            const saldo = await this.Database.executaComando(sql, [userId]);
            return saldo;
        } catch (error) {
            console.error("Erro no UserRepository.getUserSaldo:", error.message);
            ErroSqlHandler.tratarErroSql(error);
        }
    }

    async atualizarUserSaldo(userId, novoSaldo) {
        const sql = `
            UPDATE Usuarios
            SET saldo_atual = ?
            WHERE id_usuario = ?`
        ;

        try {
            const resultado = await this.Database.executaComando(sql, [novoSaldo, userId]);
            return resultado;
        } catch (error) {
            console.error("Erro no UserRepository.atualizarUserSaldo:", error.message);
            ErroSqlHandler.tratarErroSql(error);
        }
    }

    async getUserById(userId) {
        const sql = `
            SELECT *
            FROM Usuarios
            WHERE id_usuario = ?;
        `;

        try {
            const userData = await this.Database.executaComando(sql, [userId]);
            return userData[0];
        } catch (error) {
            console.error("Erro no UserRepository.getUserData:", error.message);
            ErroSqlHandler.tratarErroSql(error);
        }
    }

    async getUserByEmail(email) {
        const sql = `
            SELECT *
            FROM Usuarios
            WHERE email = ?;
        `;
        try {
            const userData = await this.Database.executaComando(sql, [email]);
            return userData[0];
        } catch (error) {
            console.error("Erro no UserRepository.getUserData:", error.message);
            ErroSqlHandler.tratarErroSql(error);
        }
    }

}

export default UserRepository;
