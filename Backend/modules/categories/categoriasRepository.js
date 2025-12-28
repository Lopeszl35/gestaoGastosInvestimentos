export default class CategoriasRepository {
  constructor(database) {
    this.database = database;
  }

  async createCategoria(categoria) {
    const sql = `
            INSERT INTO categorias_gastos (id_usuario,nome, limite) 
            VALUES (?, ?, ?);
        `;
    const params = [categoria.id_usuario, categoria.nome, categoria.limite];
    try {
      const result = await this.database.executaComandoNonQuery(sql, params);
      return result;
    } catch (error) {
      console.error(
        "Erro no CategoriasRepository.createCategoria:",
        error.message
      );
      throw error;
    }
  }

  async getCategorias(id_usuario) {
    let sql = `
            SELECT 
            cg.id_categoria,
            cg.id_usuario,
            cg.nome,
            CAST(cg.limite AS DECIMAL(10, 2)) AS limite,

            IFNULL((
                SELECT CAST(SUM(g.valor) AS DECIMAL(10, 2))
                FROM gastos g
                WHERE g.id_categoria = cg.id_categoria
            ), 0) AS totalGastos,

            IFNULL((
                SELECT CAST(SUM(g.valor) AS DECIMAL(10, 2))
                FROM gastos g
                WHERE g.id_categoria = cg.id_categoria 
                AND MONTH(g.data_gasto) = MONTH(CURDATE()) 
                AND YEAR(g.data_gasto) = YEAR(CURDATE())
            ), 0) AS totalGastosMes,

           
            IFNULL(tgm.limite_gasto_mes, 0) AS limiteGastoMes,
            IFNULL(tgm.gasto_atual_mes, 0)  AS gastoAtualMes

            FROM categorias_gastos cg
            LEFT JOIN total_gastos_mes tgm
            ON tgm.id_usuario = cg.id_usuario
            AND tgm.ano = YEAR(CURDATE())
            AND tgm.mes = MONTH(CURDATE())
        `;

    const params = [];

    console.log("id_usuario recebido: ", id_usuario);

    // Filtra as categorias pelo id_usuario, se fornecido
    if (typeof id_usuario === "number" && id_usuario > 0) {
      sql += " WHERE cg.id_usuario = ?";
      params.push(id_usuario);
    }

    console.log("SQL executado: ", sql, "com parâmetros:", params);

    try {
      const result = await this.database.executaComando(sql, params);
      console.log("result: ", result);
      return result;
    } catch (error) {
      console.error(
        "Erro no CategoriasRepository.getCategorias:",
        error.message
      );
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
      console.error(
        "Erro no CategoriasRepository.updateCategoria:",
        error.message
      );
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
      console.error(
        "Erro no CategoriasRepository.deleteCategoria:",
        error.message
      );
      throw error;
    }
  }

  
}
