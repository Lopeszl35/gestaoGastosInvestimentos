import ErroSqlHandler from "../../errors/ErroSqlHandler.js";

export default class GastosFixosRepository {
  constructor(database) {
    this.database = database;
  }

  async obterResumoGastosFixos(id_usuario) {
    try {
      const sqlTotais = `
        SELECT
          ROUND(SUM(
            CASE recorrencia
              WHEN 'mensal' THEN valor
              WHEN 'bimestral' THEN valor / 2
              WHEN 'trimestral' THEN valor / 3
              WHEN 'anual' THEN valor / 12
              ELSE valor
            END
          ), 2) AS totalMensal,
          ROUND(SUM(
            CASE recorrencia
              WHEN 'mensal' THEN valor * 12
              WHEN 'bimestral' THEN valor * 6
              WHEN 'trimestral' THEN valor * 4
              WHEN 'anual' THEN valor
              ELSE valor * 12
            END
          ), 2) AS totalAnual
        FROM gastos_fixos
        WHERE id_usuario = ?
          AND ativo = 1;
      `;

      const sqlProximos7Dias = `
        SELECT
          ROUND(SUM(x.valor), 2) AS total,
          COUNT(*) AS quantidade
        FROM (
          SELECT
            valor,
            CASE
              WHEN dia_vencimento >= DAY(CURDATE())
                THEN DATE_ADD(
                  DATE_FORMAT(CURDATE(), '%Y-%m-01'),
                  INTERVAL (LEAST(dia_vencimento, DAY(LAST_DAY(CURDATE()))) - 1) DAY
                )
              ELSE DATE_ADD(
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'),
                INTERVAL (
                  LEAST(
                    dia_vencimento,
                    DAY(LAST_DAY(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)))
                  ) - 1
                ) DAY
              )
            END AS proximo_vencimento
          FROM gastos_fixos
          WHERE id_usuario = ?
            AND ativo = 1
        ) x
        WHERE x.proximo_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);
      `;

      const [rowTotais] = await this.database.executaComando(sqlTotais, [Number(id_usuario)]);
      const [rowProximos] = await this.database.executaComando(sqlProximos7Dias, [Number(id_usuario)]);

      const totalMensal = Number(rowTotais?.totalMensal ?? 0);
      const totalAnual = Number(rowTotais?.totalAnual ?? 0);

      const totalProximos = Number(rowProximos?.total ?? 0);
      const quantidadeProximos = Number(rowProximos?.quantidade ?? 0);

      return {
        totalMensal: Number.isFinite(totalMensal) ? totalMensal : 0,
        totalAnual: Number.isFinite(totalAnual) ? totalAnual : 0,
        proximos7Dias: {
          total: Number.isFinite(totalProximos) ? totalProximos : 0,
          quantidade: Number.isFinite(quantidadeProximos) ? quantidadeProximos : 0,
        },
      };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async inserirGastoFixo(gastoFixo, id_usuario) {
    try {
      const sql = `
        INSERT INTO gastos_fixos
          (id_usuario, tipo, titulo, descricao, valor, dia_vencimento, recorrencia, ativo)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        Number(id_usuario),
        String(gastoFixo.tipo),
        String(gastoFixo.titulo),
        gastoFixo.descricao ? String(gastoFixo.descricao) : null,
        Number(gastoFixo.valor),
        Number(gastoFixo.dia_vencimento),
        String(gastoFixo.recorrencia ?? "mensal"),
        Number(gastoFixo.ativo ?? 1),
      ];

      const result = await this.database.executaComando(sql, params);

      return {
        mensagem: "Gasto fixo criado com sucesso.",
        id_gasto_fixo: result.insertId,
      };
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async listarGastosFixos(id_usuario, opts = {}) {
    try {
      const somenteAtivos = opts?.somenteAtivos === true;

      const whereAtivo = somenteAtivos ? " AND gf.ativo = 1 " : "";

      const sql = `
        SELECT
          gf.id_gasto_fixo,
          gf.tipo,
          CASE
            WHEN gf.tipo IN ('luz','agua','telefone') THEN 'Utilidades'
            WHEN gf.tipo IN ('internet','assinatura') THEN 'Assinaturas'
            ELSE 'Outros'
          END AS categoria_exibicao,
          gf.titulo,
          gf.descricao,
          gf.valor,
          gf.dia_vencimento,
          gf.recorrencia,
          gf.ativo
        FROM gastos_fixos gf
        WHERE gf.id_usuario = ?
        ${whereAtivo}
        ORDER BY gf.ativo DESC, gf.dia_vencimento ASC, gf.titulo ASC
      `;

      const rows = await this.database.executaComando(sql, [Number(id_usuario)]);

      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async buscarGastoFixoPorIdEUsuario(id_gasto_fixo, id_usuario) {
    try {
      const sql = `
        SELECT id_gasto_fixo, id_usuario, ativo
        FROM gastos_fixos
        WHERE id_gasto_fixo = ? AND id_usuario = ?
        LIMIT 1
      `;
      const rows = await this.database.executaComando(sql, [Number(id_gasto_fixo), Number(id_usuario)]);
      return Array.isArray(rows) && rows.length ? rows[0] : null;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async atualizarAtivoGastoFixo(id_gasto_fixo, id_usuario, ativo) {
    try {
      const sql = `
        UPDATE gastos_fixos
        SET ativo = ?
        WHERE id_gasto_fixo = ? AND id_usuario = ?
      `;
      const result = await this.database.executaComando(sql, [
        Number(ativo),
        Number(id_gasto_fixo),
        Number(id_usuario),
      ]);

      return result;
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

  async obterGastosFixosPorCategoria(id_usuario) {
    try {
      const sql = `
        SELECT
          CASE
            WHEN tipo IN ('luz','agua','telefone') THEN 'Utilidades'
            WHEN tipo IN ('internet','assinatura') THEN 'Assinaturas'
            ELSE 'Outros'
          END AS categoria,
          ROUND(SUM(
            CASE recorrencia
              WHEN 'mensal' THEN valor
              WHEN 'bimestral' THEN valor / 2
              WHEN 'trimestral' THEN valor / 3
              WHEN 'anual' THEN valor / 12
              ELSE valor
            END
          ), 2) AS total
        FROM gastos_fixos
        WHERE id_usuario = ?
          AND ativo = 1
        GROUP BY categoria
        ORDER BY total DESC;
      `;

      const rows = await this.database.executaComando(sql, [Number(id_usuario)]);
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      ErroSqlHandler.tratarErroSql(error);
      throw error;
    }
  }

}
