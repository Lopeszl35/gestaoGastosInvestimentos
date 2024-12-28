import mysql12 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        if (Database.instance) {
            throw new Error('A classe Database deve ser instanciada somente uma vez!');
        }

        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];
        requiredEnvVars.forEach((varName) => {
            if (!process.env[varName]) {
                throw new Error(`A variável de ambiente ${varName} não está configurada.`);
            }
        });

        this.pool = mysql12.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async executaComando(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, params);
            return rows;
        } catch (error) {
            console.error(`Erro ao executar comando SQL: ${sql}`, error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async executaComandoNonQuery(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [results] = await connection.query(sql, params);
            return results.affectedRows;
        } catch (error) {
            console.error(`Erro ao executar comando non-query SQL: ${sql}`, error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async beginTransaction() {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async commitTransaction(connection) {
        try {
            await connection.commit();
        } catch (error) {
            console.error('Erro ao cometer transação:', error);
            throw new Error('Erro ao cometer transação');
        } finally {
            connection.release();
        }
    }

    async rollbackTransaction(connection) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (error) {
                console.error('Erro ao reverter transação:', error);
                throw new Error('Erro ao reverter transação');
            } finally {
                connection.release();
            }
        }
    }
}

export default Database;
