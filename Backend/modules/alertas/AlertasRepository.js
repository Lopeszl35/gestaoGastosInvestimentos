import ErroSqlHandler from "../../errors/ErroSqlHandler.js";

export default class AlertasRepository {
  constructor(database) {
    this.database = database;
  }

  async buscarCategoriaPorId({ id_usuario, id_categoria, connection }) {
    const sql = `
      SELECT id_categoria, nome, limite, ativo
      FROM categorias_gastos
      WHERE id_usuario = ?
        AND id_categoria = ?
      LIMIT 1;
    `;

    try {
      if (connection) {
        const [rows] = await connection.query(sql, [Number(id_usuario), Number(id_categoria)]);
        return rows?.[0] ?? null;
      }

      const rows = await this.database.executaComando(sql, [Number(id_usuario), Number(id_categoria)]);
      return rows?.[0] ?? null;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async buscarTotalGastoCategoriaNoMes({ id_usuario, id_categoria, data_gasto, connection }) {
    // usa YEAR/MONTH do MySQL pra evitar problemas de timezone/parse
    const sql = `
      SELECT COALESCE(SUM(valor), 0) AS total
      FROM gastos
      WHERE id_usuario = ?
        AND id_categoria = ?
        AND YEAR(data_gasto) = YEAR(?)
        AND MONTH(data_gasto) = MONTH(?);
    `;

    const params = [Number(id_usuario), Number(id_categoria), data_gasto, data_gasto];

    try {
      if (connection) {
        const [rows] = await connection.query(sql, params);
        return Number(rows?.[0]?.total ?? 0);
      }

      const rows = await this.database.executaComando(sql, params);
      return Number(rows?.[0]?.total ?? 0);
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async existeAlertaCategoriaNoMes({
    id_usuario,
    id_categoria,
    ano,
    mes,
    tipo_alerta,
    connection,
  }) {
    const sql = `
      SELECT id_alerta
      FROM alertas_financeiros
      WHERE id_usuario = ?
        AND tipo_alerta = ?
        AND JSON_UNQUOTE(JSON_EXTRACT(dados_json, '$.id_categoria')) = ?
        AND JSON_UNQUOTE(JSON_EXTRACT(dados_json, '$.ano')) = ?
        AND JSON_UNQUOTE(JSON_EXTRACT(dados_json, '$.mes')) = ?
      LIMIT 1;
    `;

    const params = [
      Number(id_usuario),
      String(tipo_alerta),
      String(Number(id_categoria)),
      String(Number(ano)),
      String(Number(mes)),
    ];

    try {
      if (connection) {
        const [rows] = await connection.query(sql, params);
        return !!rows?.length;
      }

      const rows = await this.database.executaComando(sql, params);
      return !!rows?.length;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async criarAlerta({ id_usuario, severidade, tipo_alerta, mensagem, dados_json, connection }) {
    const sql = `
      INSERT INTO alertas_financeiros (id_usuario, severidade, tipo_alerta, mensagem, dados_json)
      VALUES (?, ?, ?, ?, ?);
    `;

    const params = [
      Number(id_usuario),
      String(severidade),
      String(tipo_alerta),
      String(mensagem),
      JSON.stringify(dados_json),
    ];

    try {
      if (connection) {
        const [result] = await connection.query(sql, params);
        return { id_alerta: result.insertId };
      }

      // sem transação: usa pool
      const affected = await this.database.executaComandoNonQuery(sql, params);
      return { affectedRows: affected };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }
}
