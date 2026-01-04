import ErroSqlHandler from "../../errors/ErroSqlHandler.js";

class GastoMesRepository {
  constructor(database) {
    this.database = database;
  }

  async configGastoLimiteMes(id_usuario, dadosMes, connection) {
    console.log("GastoMesRepository.configGastoLimiteMes chamado com:", {
      id_usuario,
      dadosMes,
    });
    try {
      const { ano, mes, limiteGastoMes } = dadosMes;

      const sql = `
        INSERT INTO total_gastos_mes (id_usuario, ano, mes, limite_gasto_mes, gasto_atual_mes)
        VALUES (?, ?, ?, ?, 0.00)
        ON DUPLICATE KEY UPDATE
          limite_gasto_mes = VALUES(limite_gasto_mes),
          updated_at = CURRENT_TIMESTAMP;
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
      throw error;
    }
  }


  async getLimiteGastosMes(id_usuario, ano, mes) {
    try {
      const sql = `
        SELECT
          *
        FROM total_gastos_mes
        WHERE id_usuario = ?
        AND ano = ?
        AND mes = ?
        LIMIT 1
      `;
      
      const params = [(Number(id_usuario)), Number(ano), Number(mes)];
      const rows = await this.database.executaComando(sql, params);
      console.log("getLimiteGastosMesRows: ", rows);
      return rows
   
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
  async recalcularGastoAtualMes(id_usuario, ano, mes, connection) {
    const conn = connection ?? this.database;

    try {
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
        Number(ano),
        Number(mes),
        Number(id_usuario),
      ]);

      return {
        mensagem: "Gasto atual do mês recalculado.",
        ano: ano,
        mes: mes,
        result,
      };
    } catch (error) {
      
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


  async addGasto(gastos, id_usuario, connection) {
    const sql = `
            INSERT INTO gastos (id_categoria, id_usuario, valor, data_gasto, descricao) 
            VALUES (?, ?, ?, ?, ?);
        `;
    const params = [
      gastos.id_categoria,
      id_usuario,
      gastos.valor,
      gastos.data_gasto,
      gastos.descricao || null, // Campo opcional
    ];

    try {
      const [result] = await connection.query(sql, params);
      if (result.affectedRows === 1) {
        return {
          mensagem: "Gasto adicionado com sucesso.",
        };
      } else {
        return {
          mensagem: "Falha ao adicionar gasto.",
          code: "FALHA_ADICAO_GASTO"
        };
      }
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

    async getSaldoAtual(id_usuario, connection) {
    const sql = `
      SELECT saldo_atual
      FROM usuarios
      WHERE id_usuario = ?
      LIMIT 1;
    `;

    try {
      if (connection) {
        const [rows] = await connection.query(sql, [Number(id_usuario)]);
        const saldo = rows?.[0]?.saldo_atual ?? 0;
        return Number(saldo);
      }

      const rows = await this.database.executaComando(sql, [Number(id_usuario)]);
      const saldo = rows?.[0]?.saldo_atual ?? 0;
      return Number(saldo);
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  /**
   * Incrementa gasto_atual_mes em total_gastos_mes baseado na data do gasto.
   * - Se não existir registro para (id_usuario, ano, mes), cria com limite_gasto_mes = 0.
   */
  async incrementarGastoAtualMes({ id_usuario, data_gasto, valor, connection }) {
    const sql = `
      INSERT INTO total_gastos_mes (id_usuario, ano, mes, limite_gasto_mes, gasto_atual_mes)
      VALUES (?, YEAR(?), MONTH(?), 0.00, ?)
      ON DUPLICATE KEY UPDATE
        gasto_atual_mes = gasto_atual_mes + VALUES(gasto_atual_mes),
        updated_at = CURRENT_TIMESTAMP;
    `;

    const params = [Number(id_usuario), data_gasto, data_gasto, Number(valor)];

    try {
      if (connection) {
        await connection.query(sql, params);
        return { mensagem: "Gasto do mês incrementado com sucesso." };
      }

      await this.database.executaComandoNonQuery(sql, params);
      return { mensagem: "Gasto do mês incrementado com sucesso." };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }


}

export default GastoMesRepository;
