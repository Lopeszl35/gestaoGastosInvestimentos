import ErroSqlHandler from "../../errors/ErroSqlHandler.js";

export default class CategoriasRepository {
  constructor(database) {
    this.database = database;
  }

  async createCategoria(categoria, id_usuario) {
    const sql = `
            INSERT INTO categorias_gastos (id_usuario, nome, limite) 
            VALUES (?, ?, ?);
        `;
    const params = [id_usuario, categoria.nome, categoria.limite];
    try {
      const result = await this.database.executaComandoNonQuery(sql, params);
      if (result) {
        return {
          mensagem: "Categoria criada com sucesso.",
        };
      } else {
        return {
          mensagem: "Falha ao criar categoria.",
          code: "FALHA_CRIACAO_CATEGORIA",
        };
      }
    } catch (error) {
      console.error("Erro no CategoriasRepository.createCategoria:",error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async checkCategoriaExists(nomeCategoria, id_usuario) {
    const sql = `
            SELECT COUNT(*) AS count 
            FROM categorias_gastos 
            WHERE LOWER(TRIM(nome)) = LOWER(TRIM(?)) 
            AND id_usuario = ?;
        `;
    const params = [nomeCategoria, id_usuario];
    try {
      const result = await this.database.executaComando(sql, params);
      return result[0].count > 0;
    } catch (error) {
      console.error("Erro no CategoriasRepository.checkCategoriaExists:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async getCategoriasAtivas(id_usuario) {
    let sql = `
           SELECT * FROM categorias_gastos
           WHERE id_usuario = ?
           AND ativo = 1
        `;

    try {
      const result = await this.database.executaComando(sql, [id_usuario]);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.getCategorias:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async updateCategoria(id_categoria, categoria) {
    const sql = `
            UPDATE categorias_gastos 
            SET nome = ?, limite = ? 
            WHERE id_categoria = ?;
        `;
    const params = [categoria.nome, categoria.limite, id_categoria];
    try {
      const result = await this.database.executaComandoNonQuery(sql, params);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.updateCategoria:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async deleteCategoria(id_categoria, connection) {
    const sql = `
            DELETE FROM categorias_gastos WHERE id_categoria = ?;
        `;
    const params = [id_categoria];
    try {
      const result = await connection.query(sql, params);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.deleteCategoria:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  
}
