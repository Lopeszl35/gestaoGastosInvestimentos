import ErroSqlHandler from "../errors/ErroSqlHandler.js";

class GastoMesRepository {
  constructor(database) {
    this.database = database;
  }

  async configGastoLimiteMes(id_usuario, dadosMes, connection) {
    try {
      const { ano, mes, limiteGastoMes } = dadosMes;

      const sql = `
        INSERT INTO total_gastos_mes (id_usuario, ano, mes, limite_gasto_mes, gasto_atual_mes)
        VALUES (?, ?, ?, ?, 0.00)
        ON DUPLICATE KEY UPDATE
          ano = VALUES(ano),
          mes = VALUES(mes),
          limite_gasto_mes = VALUES(limite_gasto_mes),

          -- Se mudar de mês/ano, zera o gasto atual do mês
          gasto_atual_mes = CASE
            WHEN ano <> VALUES(ano) OR mes <> VALUES(mes) THEN 0.00
            ELSE gasto_atual_mes
          END,

          updated_at = CURRENT_TIMESTAMP
      `;

      const params = [
        Number(id_usuario),
        Number(ano),
        Number(mes),
        Number(limiteGastoMes),
      ];

      const result = await connection.query(sql, params);

      return {
        mensagem: "Configuração mensal salva com sucesso.",
        id_usuario: Number(id_usuario),
        ano: Number(ano),
        mes: Number(mes),
        limite_gasto_mes: Number(limiteGastoMes),
        result,
      };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  /**
   * Retorna a configuração mensal atual do usuário (linha única).
   */
  async getLimiteGastosMes(id_usuario, connection) {
    const conn = connection ?? this.database;

    try {
      const sql = `
        SELECT
          id_total_gastos_mes,
          id_usuario,
          ano,
          mes,
          limite_gasto_mes,
          gasto_atual_mes,
          created_at,
          updated_at
        FROM total_gastos_mes
        WHERE id_usuario = ?
        LIMIT 1
      `;

      const rows = await conn.executaComando(sql, [Number(id_usuario)]);
      return rows?.[0] ?? null;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async atualizarLimite(id_usuario, limite_gasto_mes, connection) {
    const conn = connection ?? this.database;

    try {
      const sql = `
        UPDATE total_gastos_mes
        SET limite_gasto_mes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id_usuario = ?
      `;

      const result = await conn.executaComando(sql, [
        Number(limite_gasto_mes),
        Number(id_usuario),
      ]);

      return { mensagem: "Limite atualizado com sucesso.", result };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  /**
   * (Opcional) Recalcular gasto_atual_mes a partir da tabela gastos
   * - Útil se você quiser "consertar" caso alguém mexa manualmente no banco
   * - Ou se você inserir gastos antigos e quiser garantir consistência
   */
  async recalcularGastoAtualMes(id_usuario, connection) {
    const conn = connection ?? this.database;

    try {
      // Pega ano/mes configurados
      const cfg = await this.getLimiteGastosMes(id_usuario, conn);
      if (!cfg) return null;

      const sql = `
        UPDATE total_gastos_mes t
        JOIN (
          SELECT
            id_usuario,
            COALESCE(SUM(valor), 0) AS soma
          FROM gastos
          WHERE id_usuario = ?
            AND YEAR(data_gasto) = ?
            AND MONTH(data_gasto) = ?
        ) g ON g.id_usuario = t.id_usuario
        SET t.gasto_atual_mes = g.soma,
            t.updated_at = CURRENT_TIMESTAMP
        WHERE t.id_usuario = ?
      `;

      const result = await conn.executaComando(sql, [
        Number(id_usuario),
        Number(cfg.ano),
        Number(cfg.mes),
        Number(id_usuario),
      ]);

      return {
        mensagem: "Gasto atual do mês recalculado.",
        ano: cfg.ano,
        mes: cfg.mes,
        result,
      };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async getGastosTotaisPorCategoria({ idUsuario, inicio, fim }) {
    try {
       const params = [idUsuario];

    const filtroPeriodo =
      inicio && fim ? "AND g.data_gasto BETWEEN ? AND ?" : "";

    if (inicio && fim) {
      params.push(inicio, fim);
    }

    // Observação: LEFT JOIN pra trazer categoria mesmo se não tiver gasto
    const sql = `
      SELECT
        cg.id_categoria,
        cg.nome AS nomeCategoria,
        g.id_gasto,
        DATE_FORMAT(g.data_gasto, '%Y-%m-%d') AS data_gasto,
        CAST(g.valor AS DECIMAL(10,2)) AS valor,
        IFNULL(g.descricao, '') AS descricao
      FROM gastos g
      JOIN categorias_gastos cg
        ON cg.id_categoria = g.id_categoria
      AND cg.id_usuario   = g.id_usuario
      WHERE g.id_usuario = 1
      ${filtroPeriodo}
      ORDER BY cg.nome, g.data_gasto, g.id_gasto;
    `;

    // ⚠️ Repare: cg.id_usuario = ? precisa ser o último param
    // mas params já começou com idUsuario. Então ajustamos:
    // - coloco o WHERE cg.id_usuario = ? no final do SQL,
    // - e passo o idUsuario no final do array.

    // Mais simples: reordenar params:
    const orderedParams =
      inicio && fim
        ? [inicio, fim, idUsuario]
        : [idUsuario];

    const result = await this.database.executaComando(sql, orderedParams);
    console.log("Gastos totais por categoria:", result);
    return result;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }
}

export default GastoMesRepository;
