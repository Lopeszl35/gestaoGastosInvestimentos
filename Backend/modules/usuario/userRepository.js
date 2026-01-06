import ErroSqlHandler from '../../errors/ErroSqlHandler.js';
import NaoEncontrado from '../../errors/naoEncontrado.js';

class UserRepository {
    constructor(Database) {
        this.Database = Database;
    }

    async diminuirSaldoAtual({ id_usuario, valor, connection }) {
        const sql = `
            UPDATE usuarios
            SET saldo_atual = saldo_atual - ?
            WHERE id_usuario = ?
            AND saldo_atual >= ?;
        `;

        const params = [Number(valor), Number(id_usuario), Number(valor)];

        try {
            if (connection) {
            const [result] = await connection.query(sql, params);

            if (result.affectedRows === 0) {
                const erro = new Error("Saldo insuficiente para realizar o gasto.");
                erro.code = "SALDO_INSUFICIENTE";
                throw erro;
            }

            return { mensagem: "Saldo atualizado com sucesso." };
            }

            return { mensagem: "Saldo atualizado com sucesso." };
        } catch (error) {
            console.error("Erro no UserRepository.diminuirSaldoAtual:", error.message);
            throw error;
        }
        }


    /**
     * Cria um usuário no banco de dados.
     * @param {Object} user - Dados do usuário a serem salvos.
     * @param {Object} connection - Conexão do banco de dados.
     * @returns {Object} Resultado da inserção.
     */
    async createUser(user) {
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
            user.saldo_inicial ? user.saldo_inicial : 0,
            user.saldo_atual,
        ];
        console.log("Parametros para criação do usuário:", params);
        try {
            const result = await this.Database.executaComando(sql, params);
            return { insertId: result.insertId, result: result };
        } catch (error) {
            ErroSqlHandler.tratarErroSql(error);
            throw error;
        }
    }

async atualizarUsuario(idUsuario, dadosParaAtualizacao) {
    const colunasParaAtualizar = Object.keys(dadosParaAtualizacao);

    const clausulaSet = colunasParaAtualizar
        .map((nomeColuna) => `${nomeColuna} = ?`)
        .join(", ");

    const valoresParaAtualizacao = colunasParaAtualizar.map(
        (nomeColuna) => dadosParaAtualizacao[nomeColuna]
    );

    valoresParaAtualizacao.push(idUsuario);

    const sql = `
        UPDATE Usuarios
        SET ${clausulaSet}
        WHERE id_usuario = ?;
    `;

    try {
        const resultado = await this.Database.executaComando(sql, valoresParaAtualizacao);
        return resultado;
    } catch (erro) {
        ErroSqlHandler.tratarErroSql(erro);
        throw erro;
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

    async deleteUser(userId) {
        const sql = `
            DELETE FROM Usuarios
            WHERE id_usuario = ?;
        `;
        try {
            const result = await this.Database.executaComando(sql, [userId]);
            if (result.affectedRows === 0) {
                throw new NaoEncontrado('Usuário não encontrado ou já deletado.');
            }
            return result;
        } catch (error) {
            console.error("Erro no UserRepository.deleteUser:", error.message);
            ErroSqlHandler.tratarErroSql(error);
        }
    }

}

export default UserRepository;
