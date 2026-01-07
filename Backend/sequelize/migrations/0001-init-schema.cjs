"use strict";

/**
 * Migration: schema inicial completo do banco gastosinvestimentosdb (MariaDB/MySQL)
 * - Cria tabelas na ordem certa (respeitando FKs)
 * - Cria índices / uniques
 * - Cria enums compatíveis com MariaDB
 *
 * Observação:
 * - CHECK constraints (ex: json_valid) podem variar em suporte/validação dependendo da versão do MariaDB.
 *   Aqui eu deixo como SQL opcional em pontos chave.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // =========================
    // 1) usuarios (base)
    // =========================
    await queryInterface.createTable("usuarios", {
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      nome: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      senha_hash: { type: DataTypes.STRING(255), allowNull: false },
      perfil_financeiro: { type: DataTypes.ENUM("conservador", "moderado", "arrojado"), allowNull: true, defaultValue: "moderado" },
      salario_mensal: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      saldo_inicial: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      saldo_atual: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      data_cadastro: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    // =========================
    // 2) categorias_gastos
    // =========================
    await queryInterface.createTable("categorias_gastos", {
      id_categoria: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      nome: { type: DataTypes.STRING(100), allowNull: false },
      limite: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      inativado_em: { type: DataTypes.DATE, allowNull: true },
      nome_normalizado: { type: DataTypes.STRING(255), allowNull: true },
    });

    await queryInterface.addConstraint("categorias_gastos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "categorias_gastos_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("categorias_gastos", ["id_usuario", "ativo"], { name: "idx_categorias_usuario_ativo" });
    await queryInterface.addIndex("categorias_gastos", ["id_usuario", "ativo"], { name: "idx_cat_usuario_ativo" });
    await queryInterface.addIndex("categorias_gastos", ["id_usuario", "nome_normalizado"], { name: "idx_cat_usuario_nome_norm" });

    // UNIQUE do dump: uk_usuario_categoria_ativo (id_usuario, nome, ativo)
    await queryInterface.addConstraint("categorias_gastos", {
      fields: ["id_usuario", "nome", "ativo"],
      type: "unique",
      name: "uk_usuario_categoria_ativo",
    });

    // =========================
    // 3) categorias_investimentos
    // =========================
    await queryInterface.createTable("categorias_investimentos", {
      id_categoria_investimento: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      nome: { type: DataTypes.STRING(100), allowNull: false },
    });

    await queryInterface.addConstraint("categorias_investimentos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "categorias_investimentos_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("categorias_investimentos", ["id_usuario"], { name: "id_usuario" });

    // =========================
    // 4) cartoes_credito
    // =========================
    await queryInterface.createTable("cartoes_credito", {
      id_cartao: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      uuid_cartao: { type: DataTypes.CHAR(36), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      nome: { type: DataTypes.STRING(80), allowNull: false },
      ultimos4: { type: DataTypes.CHAR(4), allowNull: true },
      bandeira: { type: DataTypes.STRING(30), allowNull: true },
      cor_hex: { type: DataTypes.STRING(10), allowNull: true },
      limite: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      dia_fechamento: { type: DataTypes.TINYINT, allowNull: false },
      dia_vencimento: { type: DataTypes.TINYINT, allowNull: false },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },

      nome_norm: { type: DataTypes.STRING(120), allowNull: false },
      bandeira_norm: { type: DataTypes.STRING(30), allowNull: false },
      ultimos4_norm: { type: DataTypes.STRING(4), allowNull: false },
    });

    await queryInterface.addConstraint("cartoes_credito", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_cartoes_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("cartoes_credito", {
      fields: ["uuid_cartao"],
      type: "unique",
      name: "uq_cartoes_credito_uuid",
    });

    // unique: cartão único por usuário + ativo (anti-duplicado)
    await queryInterface.addConstraint("cartoes_credito", {
      fields: ["id_usuario", "nome_norm", "bandeira_norm", "ultimos4_norm", "ativo"],
      type: "unique",
      name: "uq_cartao_unico_usuario_ativo",
    });

    await queryInterface.addIndex("cartoes_credito", ["id_usuario"], { name: "idx_cartoes_usuario" });
    await queryInterface.addIndex("cartoes_credito", ["id_usuario", "ativo"], { name: "idx_cartoes_usuario_ativo" });

    // Checks (opcionais — dependendo da versão)
    // await queryInterface.sequelize.query(
    //   "ALTER TABLE cartoes_credito ADD CONSTRAINT chk_cartao_ultimos4 CHECK (ultimos4 is null or ultimos4 regexp '^[0-9]{4}$')"
    // );
    // await queryInterface.sequelize.query(
    //   "ALTER TABLE cartoes_credito ADD CONSTRAINT chk_cartao_fechamento CHECK (dia_fechamento between 1 and 28)"
    // );
    // await queryInterface.sequelize.query(
    //   "ALTER TABLE cartoes_credito ADD CONSTRAINT chk_cartao_vencimento CHECK (dia_vencimento between 1 and 28)"
    // );

    // =========================
    // 5) cartao_faturas
    // =========================
    await queryInterface.createTable("cartao_faturas", {
      id_fatura: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_cartao: { type: DataTypes.INTEGER(11), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      ano: { type: DataTypes.INTEGER(11), allowNull: false },
      mes: { type: DataTypes.TINYINT, allowNull: false },
      total_lancamentos: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      total_pago: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      status: { type: DataTypes.ENUM("aberta", "fechada", "paga"), allowNull: false, defaultValue: "aberta" },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("cartao_faturas", {
      fields: ["id_cartao"],
      type: "foreign key",
      name: "fk_fatura_cartao",
      references: { table: "cartoes_credito", field: "id_cartao" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("cartao_faturas", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_fatura_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("cartao_faturas", {
      fields: ["id_cartao", "ano", "mes"],
      type: "unique",
      name: "unico_cartao_ano_mes",
    });

    await queryInterface.addIndex("cartao_faturas", ["id_usuario"], { name: "idx_fatura_usuario" });
    await queryInterface.addIndex("cartao_faturas", ["id_usuario", "id_cartao", "ano", "mes"], { name: "idx_fatura_usuario_cartao_mes" });

    // =========================
    // 6) cartao_lancamentos
    // =========================
    await queryInterface.createTable("cartao_lancamentos", {
      id_lancamento: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_cartao: { type: DataTypes.INTEGER(11), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: false },
      categoria: { type: DataTypes.STRING(80), allowNull: true },
      grupo_parcelamento: { type: DataTypes.STRING(36), allowNull: true },
      valor_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      numero_parcelas: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: 1 },
      valor_parcela: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      parcelas_pagas: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: 0 },
      data_compra: { type: DataTypes.DATEONLY, allowNull: false },
      primeiro_mes_ref: { type: DataTypes.DATEONLY, allowNull: false },
      fatura_ano: { type: DataTypes.INTEGER(11), allowNull: true },
      fatura_mes: { type: DataTypes.TINYINT, allowNull: true },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("cartao_lancamentos", {
      fields: ["id_cartao"],
      type: "foreign key",
      name: "fk_lanc_cartao",
      references: { table: "cartoes_credito", field: "id_cartao" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("cartao_lancamentos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_lanc_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("cartao_lancamentos", ["id_cartao"], { name: "idx_lanc_cartao" });
    await queryInterface.addIndex("cartao_lancamentos", ["id_usuario"], { name: "idx_lanc_usuario" });
    await queryInterface.addIndex("cartao_lancamentos", ["primeiro_mes_ref"], { name: "idx_lanc_mesref" });
    await queryInterface.addIndex("cartao_lancamentos", ["id_usuario", "fatura_ano", "fatura_mes"], { name: "idx_lanc_usuario_fatura" });
    await queryInterface.addIndex("cartao_lancamentos", ["id_cartao", "fatura_ano", "fatura_mes"], { name: "idx_lanc_cartao_fatura" });
    await queryInterface.addIndex("cartao_lancamentos", ["id_usuario", "grupo_parcelamento"], { name: "idx_lanc_grupo_parc" });

    // =========================
    // 7) gastos
    // =========================
    await queryInterface.createTable("gastos", {
      id_gasto: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      id_categoria: { type: DataTypes.INTEGER(11), allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: true },
      origem_lancamento: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "manual" },
      metadados_json: { type: DataTypes.TEXT("long"), allowNull: true },
      descricao_normalizada: { type: DataTypes.STRING(255), allowNull: true },
      forma_pagamento: { type: DataTypes.ENUM("DINHEIRO", "PIX", "DEBITO", "CREDITO"), allowNull: false, defaultValue: "DINHEIRO" },
      id_cartao: { type: DataTypes.INTEGER(11), allowNull: true },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      data_gasto: { type: DataTypes.DATEONLY, allowNull: false },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      atualizado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("gastos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "gastos_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("gastos", {
      fields: ["id_categoria"],
      type: "foreign key",
      name: "gastos_ibfk_2",
      references: { table: "categorias_gastos", field: "id_categoria" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("gastos", {
      fields: ["id_cartao"],
      type: "foreign key",
      name: "fk_gastos_cartao",
      references: { table: "cartoes_credito", field: "id_cartao" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("gastos", ["id_categoria"], { name: "id_categoria" });
    await queryInterface.addIndex("gastos", ["forma_pagamento"], { name: "idx_gastos_forma_pagamento" });
    await queryInterface.addIndex("gastos", ["id_cartao"], { name: "idx_gastos_id_cartao" });
    await queryInterface.addIndex("gastos", ["id_usuario", "data_gasto"], { name: "idx_gastos_usuario_data" });
    await queryInterface.addIndex("gastos", ["id_usuario", "origem_lancamento"], { name: "idx_gastos_usuario_origem" });
    await queryInterface.addIndex("gastos", ["id_usuario", "id_categoria", "data_gasto"], { name: "idx_gastos_usuario_categoria_data" });

    // (Opcional) CHECK json_valid
    // await queryInterface.sequelize.query(
    //   "ALTER TABLE gastos ADD CONSTRAINT chk_gastos_metadados_json CHECK (metadados_json is null or json_valid(metadados_json))"
    // );

    // =========================
    // 8) receitas
    // =========================
    await queryInterface.createTable("receitas", {
      id_receita: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      data_receita: { type: DataTypes.DATEONLY, allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: true },
      origem_lancamento: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "manual" },
      metadados_json: { type: DataTypes.TEXT("long"), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      atualizado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("receitas", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_receitas_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("receitas", ["id_usuario", "data_receita"], { name: "idx_receitas_usuario_data" });

    // =========================
    // 9) total_gastos_mes
    // =========================
    await queryInterface.createTable("total_gastos_mes", {
      id_total_gastos_mes: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      ano: { type: DataTypes.INTEGER(11), allowNull: false },
      mes: { type: DataTypes.TINYINT, allowNull: false },
      limite_gasto_mes: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      gasto_atual_mes: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("total_gastos_mes", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_total_mes_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("total_gastos_mes", {
      fields: ["id_usuario", "ano", "mes"],
      type: "unique",
      name: "unico_usuario_ano_mes",
    });

    // =========================
    // 10) gastos_fixos
    // =========================
    await queryInterface.createTable("gastos_fixos", {
      id_gasto_fixo: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      tipo: { type: DataTypes.ENUM("luz", "agua", "internet", "assinatura", "telefone", "outro"), allowNull: false, defaultValue: "outro" },
      titulo: { type: DataTypes.STRING(80), allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: true },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      dia_vencimento: { type: DataTypes.TINYINT, allowNull: false },
      recorrencia: { type: DataTypes.ENUM("mensal", "bimestral", "trimestral", "anual"), allowNull: false, defaultValue: "mensal" },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("gastos_fixos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_gf_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("gastos_fixos", ["id_usuario"], { name: "idx_gf_usuario" });
    await queryInterface.addIndex("gastos_fixos", ["id_usuario", "ativo"], { name: "idx_gf_usuario_ativo" });
    await queryInterface.addIndex("gastos_fixos", ["id_usuario", "dia_vencimento"], { name: "idx_gf_usuario_venc" });

    // =========================
    // 11) historico_saldos
    // =========================
    await queryInterface.createTable("historico_saldos", {
      id_historico: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      saldo_anterior: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      saldo_atual: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      data_alteracao: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("historico_saldos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "historico_saldos_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("historico_saldos", ["id_usuario"], { name: "id_usuario" });

    // =========================
    // 12) metas_financeiras
    // =========================
    await queryInterface.createTable("metas_financeiras", {
      id_meta: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      titulo: { type: DataTypes.STRING(120), allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: true },
      tipo_meta: { type: DataTypes.STRING(40), allowNull: false },
      valor_alvo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      valor_atual: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
      data_inicio: { type: DataTypes.DATEONLY, allowNull: false },
      data_fim: { type: DataTypes.DATEONLY, allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "ativa" },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      atualizado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("metas_financeiras", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_metas_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("metas_financeiras", ["id_usuario", "status"], { name: "idx_metas_usuario_status" });

    // =========================
    // 13) dividas
    // =========================
    await queryInterface.createTable("dividas", {
      id_divida: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      descricao: { type: DataTypes.STRING(255), allowNull: false },
      valor_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      valor_pago: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      taxa_juros: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      data_vencimento: { type: DataTypes.DATEONLY, allowNull: false },
    });

    await queryInterface.addConstraint("dividas", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "dividas_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("dividas", ["id_usuario"], { name: "id_usuario" });

    // =========================
    // 14) financiamentos
    // =========================
    await queryInterface.createTable("financiamentos", {
      id_financiamento: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      titulo: { type: DataTypes.STRING(120), allowNull: false },
      instituicao: { type: DataTypes.STRING(120), allowNull: true },
      valor_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0.0 },
      valor_parcela: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      numero_parcelas: { type: DataTypes.INTEGER(11), allowNull: false },
      parcelas_pagas: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: 0 },
      data_inicio: { type: DataTypes.DATEONLY, allowNull: false },
      dia_vencimento: { type: DataTypes.TINYINT, allowNull: false },
      taxa_juros_mensal: { type: DataTypes.DECIMAL(6, 4), allowNull: true },
      ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("financiamentos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_fin_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("financiamentos", ["id_usuario"], { name: "idx_fin_usuario" });

    // =========================
    // 15) financiamento_parcelas
    // =========================
    await queryInterface.createTable("financiamento_parcelas", {
      id_parcela: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_financiamento: { type: DataTypes.INTEGER(11), allowNull: false },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      ano: { type: DataTypes.INTEGER(11), allowNull: false },
      mes: { type: DataTypes.TINYINT, allowNull: false },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: { type: DataTypes.ENUM("aberta", "paga", "atrasada"), allowNull: false, defaultValue: "aberta" },
      data_pagamento: { type: DataTypes.DATEONLY, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("financiamento_parcelas", {
      fields: ["id_financiamento"],
      type: "foreign key",
      name: "fk_parc_fin",
      references: { table: "financiamentos", field: "id_financiamento" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("financiamento_parcelas", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_parc_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("financiamento_parcelas", {
      fields: ["id_financiamento", "ano", "mes"],
      type: "unique",
      name: "unico_fin_ano_mes",
    });

    await queryInterface.addIndex("financiamento_parcelas", ["id_usuario"], { name: "idx_parc_usuario" });

    // =========================
    // 16) investimentos
    // =========================
    await queryInterface.createTable("investimentos", {
      id_investimento: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      id_categoria_investimento: { type: DataTypes.INTEGER(11), allowNull: false },
      nome_ativo: { type: DataTypes.STRING(100), allowNull: false },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      variacao_valor: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      data_investimento: { type: DataTypes.DATEONLY, allowNull: false },
    });

    await queryInterface.addConstraint("investimentos", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "investimentos_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("investimentos", {
      fields: ["id_categoria_investimento"],
      type: "foreign key",
      name: "investimentos_ibfk_2",
      references: { table: "categorias_investimentos", field: "id_categoria_investimento" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("investimentos", ["id_usuario"], { name: "id_usuario" });
    await queryInterface.addIndex("investimentos", ["id_categoria_investimento"], { name: "id_categoria_investimento" });

    // =========================
    // 17) alertas_financeiros
    // =========================
    await queryInterface.createTable("alertas_financeiros", {
      id_alerta: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      tipo_alerta: { type: DataTypes.STRING(40), allowNull: false },
      severidade: { type: DataTypes.STRING(15), allowNull: false },
      mensagem: { type: DataTypes.STRING(255), allowNull: false },
      dados_json: { type: DataTypes.TEXT("long"), allowNull: true },
      visto_em: { type: DataTypes.DATE, allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("alertas_financeiros", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_alertas_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("alertas_financeiros", ["id_usuario", "visto_em"], { name: "idx_alertas_usuario_visto" });

    // =========================
    // 18) eventos_usuario
    // =========================
    await queryInterface.createTable("eventos_usuario", {
      id_evento_usuario: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      tipo_evento: { type: DataTypes.STRING(60), allowNull: false },
      metadados: { type: DataTypes.TEXT("long"), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("eventos_usuario", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_eventos_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("eventos_usuario", ["id_usuario", "created_at"], { name: "idx_eventos_usuario_data" });
    await queryInterface.addIndex("eventos_usuario", ["tipo_evento"], { name: "idx_eventos_tipo" });

    // =========================
    // 19) event_outbox
    // =========================
    await queryInterface.createTable("event_outbox", {
      id_evento: { type: DataTypes.CHAR(36), allowNull: false, primaryKey: true },
      tipo_evento: { type: DataTypes.STRING(60), allowNull: false },
      aggregate_type: { type: DataTypes.STRING(30), allowNull: false },
      aggregate_id: { type: DataTypes.INTEGER(11), allowNull: true },
      payload_json: { type: DataTypes.TEXT("long"), allowNull: false },
      status: { type: DataTypes.ENUM("PENDENTE", "PROCESSANDO", "PROCESSADO", "FALHOU"), allowNull: false, defaultValue: "PENDENTE" },
      tentativas: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: 0 },
      dedupe_key: { type: DataTypes.STRING(120), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      processado_em: { type: DataTypes.DATE, allowNull: true },
    });

    await queryInterface.addConstraint("event_outbox", {
      fields: ["dedupe_key"],
      type: "unique",
      name: "uq_outbox_dedupe",
    });

    await queryInterface.addIndex("event_outbox", ["status", "criado_em"], { name: "idx_outbox_status_criado" });

    // =========================
    // 20) categorias_auditoria
    // =========================
    await queryInterface.createTable("categorias_auditoria", {
      id_auditoria: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      id_categoria: { type: DataTypes.INTEGER(11), allowNull: false },
      acao: { type: DataTypes.ENUM("CRIADA", "EDITADA", "INATIVADA", "REATIVADA"), allowNull: false },
      antes_json: { type: DataTypes.TEXT("long"), allowNull: true },
      depois_json: { type: DataTypes.TEXT("long"), allowNull: true },
      correlation_id: { type: DataTypes.CHAR(36), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("categorias_auditoria", ["id_usuario", "criado_em"], { name: "idx_cat_aud_usuario_data" });
    await queryInterface.addIndex("categorias_auditoria", ["id_categoria"], { name: "idx_cat_aud_categoria" });

    // =========================
    // 21) gastos_auditoria
    // =========================
    await queryInterface.createTable("gastos_auditoria", {
      id_auditoria: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      id_gasto: { type: DataTypes.INTEGER(11), allowNull: false },
      acao: { type: DataTypes.ENUM("CRIADO", "EDITADO", "REMOVIDO", "RECLASSIFICADO"), allowNull: false },
      antes_json: { type: DataTypes.TEXT("long"), allowNull: true },
      depois_json: { type: DataTypes.TEXT("long"), allowNull: true },
      correlation_id: { type: DataTypes.CHAR(36), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("gastos_auditoria", ["id_usuario", "criado_em"], { name: "idx_auditoria_usuario_data" });
    await queryInterface.addIndex("gastos_auditoria", ["id_gasto"], { name: "idx_auditoria_gasto" });

    // =========================
    // 22) ia_conversas
    // =========================
    await queryInterface.createTable("ia_conversas", {
      id_conversa: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      titulo: { type: DataTypes.STRING(120), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      atualizado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("ia_conversas", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_ia_conversas_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("ia_conversas", ["id_usuario"], { name: "fk_ia_conversas_usuario" });

    // =========================
    // 23) ia_mensagens
    // =========================
    await queryInterface.createTable("ia_mensagens", {
      id_mensagem: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_conversa: { type: DataTypes.INTEGER(11), allowNull: false },
      papel: { type: DataTypes.STRING(15), allowNull: false },
      conteudo: { type: DataTypes.TEXT, allowNull: false },
      metadados_json: { type: DataTypes.TEXT("long"), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("ia_mensagens", {
      fields: ["id_conversa"],
      type: "foreign key",
      name: "fk_ia_mensagens_conversa",
      references: { table: "ia_conversas", field: "id_conversa" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("ia_mensagens", ["id_conversa"], { name: "fk_ia_mensagens_conversa" });

    // =========================
    // 24) ia_perfis_usuario
    // =========================
    await queryInterface.createTable("ia_perfis_usuario", {
      id_ia_perfil: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      referencia_data: { type: DataTypes.DATEONLY, allowNull: false },
      perfil_json: { type: DataTypes.TEXT("long"), allowNull: false },
      versao_modelo: { type: DataTypes.STRING(50), allowNull: false },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("ia_perfis_usuario", {
      fields: ["id_usuario", "referencia_data", "versao_modelo"],
      type: "unique",
      name: "unico_usuario_data_modelo",
    });

    await queryInterface.addConstraint("ia_perfis_usuario", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_ia_perfis_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // =========================
    // 25) ia_feedback_classificacao
    // =========================
    await queryInterface.createTable("ia_feedback_classificacao", {
      id_feedback: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      id_gasto: { type: DataTypes.INTEGER(11), allowNull: true },
      origem_lancamento: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "manual" },
      categoria_sugerida: { type: DataTypes.INTEGER(11), allowNull: true },
      categoria_confirmada: { type: DataTypes.INTEGER(11), allowNull: true },
      observacao: { type: DataTypes.STRING(255), allowNull: true },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("ia_feedback_classificacao", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "fk_feedback_usuario",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("ia_feedback_classificacao", {
      fields: ["id_gasto"],
      type: "foreign key",
      name: "fk_feedback_gasto",
      references: { table: "gastos", field: "id_gasto" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("ia_feedback_classificacao", {
      fields: ["categoria_sugerida"],
      type: "foreign key",
      name: "fk_feedback_categoria_sugerida",
      references: { table: "categorias_gastos", field: "id_categoria" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("ia_feedback_classificacao", {
      fields: ["categoria_confirmada"],
      type: "foreign key",
      name: "fk_feedback_categoria_confirmada",
      references: { table: "categorias_gastos", field: "id_categoria" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("ia_feedback_classificacao", ["id_usuario", "criado_em"], { name: "idx_feedback_usuario_data" });
    await queryInterface.addIndex("ia_feedback_classificacao", ["id_gasto"], { name: "fk_feedback_gasto" });
    await queryInterface.addIndex("ia_feedback_classificacao", ["categoria_sugerida"], { name: "fk_feedback_categoria_sugerida" });
    await queryInterface.addIndex("ia_feedback_classificacao", ["categoria_confirmada"], { name: "fk_feedback_categoria_confirmada" });

    // =========================
    // 26) lancamentos_pendentes
    // =========================
    await queryInterface.createTable("lancamentos_pendentes", {
      id_pendente: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      origem: { type: DataTypes.ENUM("openfinance"), allowNull: false, defaultValue: "openfinance" },
      transacao_json: { type: DataTypes.TEXT("long"), allowNull: false },
      categoria_sugerida_id: { type: DataTypes.INTEGER(11), allowNull: true },
      confianca: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      status: { type: DataTypes.ENUM("PENDENTE", "APROVADO", "CORRIGIDO", "DESCARTADO"), allowNull: false, defaultValue: "PENDENTE" },
      criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      resolvido_em: { type: DataTypes.DATE, allowNull: true },
    });

    await queryInterface.addIndex("lancamentos_pendentes", ["id_usuario", "status", "criado_em"], { name: "idx_pend_usuario_status" });

    // =========================
    // 27) simulacoes_financeiras
    // =========================
    await queryInterface.createTable("simulacoes_financeiras", {
      id_simulacao: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER(11), allowNull: false },
      tipo_simulacao: { type: DataTypes.ENUM("gastos", "investimentos"), allowNull: false },
      parametros: { type: DataTypes.TEXT("long"), allowNull: false },
      resultado: { type: DataTypes.TEXT("long"), allowNull: false },
      data_simulacao: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("simulacoes_financeiras", {
      fields: ["id_usuario"],
      type: "foreign key",
      name: "simulacoes_financeiras_ibfk_1",
      references: { table: "usuarios", field: "id_usuario" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("simulacoes_financeiras", ["id_usuario"], { name: "id_usuario" });

    // =========================
    // 28) educacao_financeira
    // =========================
    await queryInterface.createTable("educacao_financeira", {
      id_material: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      titulo: { type: DataTypes.STRING(255), allowNull: false },
      tipo: { type: DataTypes.ENUM("artigo", "video", "tutorial"), allowNull: false },
      conteudo: { type: DataTypes.TEXT, allowNull: true },
      link_externo: { type: DataTypes.STRING(255), allowNull: true },
    });

    // =========================
    // 29) sessions
    // =========================
    await queryInterface.createTable("sessions", {
      session_id: { type: DataTypes.STRING(128), allowNull: false, primaryKey: true },
      expires: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
      data: { type: DataTypes.TEXT("medium"), allowNull: true },
    });
  },

  async down(queryInterface) {
    // Ordem reversa para respeitar FKs
    await queryInterface.dropTable("sessions");
    await queryInterface.dropTable("educacao_financeira");
    await queryInterface.dropTable("simulacoes_financeiras");
    await queryInterface.dropTable("lancamentos_pendentes");
    await queryInterface.dropTable("ia_feedback_classificacao");
    await queryInterface.dropTable("ia_perfis_usuario");
    await queryInterface.dropTable("ia_mensagens");
    await queryInterface.dropTable("ia_conversas");
    await queryInterface.dropTable("gastos_auditoria");
    await queryInterface.dropTable("categorias_auditoria");
    await queryInterface.dropTable("event_outbox");
    await queryInterface.dropTable("eventos_usuario");
    await queryInterface.dropTable("alertas_financeiros");
    await queryInterface.dropTable("investimentos");
    await queryInterface.dropTable("financiamento_parcelas");
    await queryInterface.dropTable("financiamentos");
    await queryInterface.dropTable("dividas");
    await queryInterface.dropTable("metas_financeiras");
    await queryInterface.dropTable("historico_saldos");
    await queryInterface.dropTable("gastos_fixos");
    await queryInterface.dropTable("total_gastos_mes");
    await queryInterface.dropTable("receitas");
    await queryInterface.dropTable("gastos");
    await queryInterface.dropTable("cartao_lancamentos");
    await queryInterface.dropTable("cartao_faturas");
    await queryInterface.dropTable("cartoes_credito");
    await queryInterface.dropTable("categorias_investimentos");
    await queryInterface.dropTable("categorias_gastos");
    await queryInterface.dropTable("usuarios");

    // Importante: remover enums criados pelo Sequelize (em MySQL/MariaDB não costuma criar tabela separada, então ok).
  },
};
