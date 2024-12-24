class UserRepository {
    constructor(Database) {
        this.Database = Database;
    }

    async createUser(user, connection) {
        const sql = `
            INSERT INTO Usuarios (nome, email, senha_hash, perfil_financeiro, salario_mensal, saldo_inicial, saldo_atual)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `
        const params = [user.nome, user.email, user.senha_hash, user.perfil_financeiro, user.salario_mensal, user.saldo_inicial, user.saldo_atual];
        try {
            const [result] = await connection.query(sql, params);
            return { insertId: result.insertId, result: result };
        } catch (error) {
            console.error('Erro no UserRepository.createUser:', error.message);
            throw error;
        }
    }
}

export default UserRepository;