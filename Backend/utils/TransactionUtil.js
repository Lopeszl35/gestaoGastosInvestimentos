class TransactionUtil {
    constructor(Database) {
        this.Database = Database;
    }

    /**
     * Executa uma função dentro de uma transação.
     * @param {Function} callback Função contendo a lógica a ser executada na transação.
     * @returns {Promise<any>} Resultado da execução do callback.
     */
    async executeTransaction(callback) {
        let connection;

        try {
            // Inicia a conexão e a transação
            connection = await this.Database.beginTransaction();

            // Executa a lógica passada pelo callback
            const result = await callback(connection);

            // Faz o commit da transação
            await this.Database.commitTransaction(connection);

            return result;
        } catch (error) {
            // Faz o rollback da transação em caso de erro
            if (connection) {
                await this.Database.rollbackTransaction(connection);
            }
            throw error; // Propaga o erro para o chamador
        }
    }
}

export default TransactionUtil;
