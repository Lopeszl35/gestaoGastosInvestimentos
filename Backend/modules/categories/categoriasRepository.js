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
           SELECT 
      cg.id_categoria,
      cg.nome,
      cg.limite,
      cg.ativo,
      COALESCE(SUM(g.valor), 0) AS totalGastoCategoriaMes,
      CASE
        WHEN cg.limite IS NULL OR cg.limite = 0 THEN NULL
        ELSE ROUND((COALESCE(SUM(g.valor), 0) / cg.limite) * 100, 2)
      END AS percentualGastoCategoriaMes
    FROM categorias_gastos cg
    LEFT JOIN gastos g
      ON g.id_categoria = cg.id_categoria
      AND g.id_usuario = cg.id_usuario
    WHERE cg.id_usuario = ?
      AND cg.ativo = 1
    GROUP BY cg.id_categoria, cg.nome, cg.limite, cg.ativo
    ORDER BY cg.nome ASC;
        `;

    try {
      const result = await this.database.executaComando(sql, [id_usuario]);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.getCategorias:", error.message);
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

  async deleteCategoria(id_categoria, dataAtual, connection) {
    const sql = `
            UPDATE categorias_gastos 
            SET ativo = 0,inativado_em = ?
            WHERE id_categoria = ?;
        `;
    const params = [dataAtual, id_categoria];
    try {
      const result = await connection.query(sql, params);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.deleteCategoria:", error.message);
      
      throw error;
    }
  }

  async getCategoriasInativas(id_usuario) {
    const sql = `
            SELECT * 
            FROM categorias_gastos 
            WHERE id_usuario = ? 
            AND ativo = 0;
        `;
    const params = [id_usuario];
    try {
      const result = await this.database.executaComando(sql, params);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.getCategoriasInativas:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async reativarCategoria(id_categoria, id_usuario, connection) {
    console.log('idUsuario e idCategoria: ', id_categoria, id_usuario);
    const sql = `
            UPDATE categorias_gastos 
            SET ativo = 1 
            WHERE id_categoria = ? 
            AND id_usuario = ?;
        `;
    const params = [id_categoria, id_usuario];
    try {
      const result = await connection.query(sql, params);
      return result;
    } catch (error) {
      console.error("Erro no CategoriasRepository.reativarCategoria:", error.message);
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }
  
}
