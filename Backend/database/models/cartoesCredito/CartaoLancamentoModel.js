import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize.js";

export class CartaoLancamentoModel extends Model {}

CartaoLancamentoModel.init(
  {
    idLancamento: {
      type: DataTypes.INTEGER,
      field: "id_lancamento",
      primaryKey: true,
      autoIncrement: true,
    },
    idCartao: {
      type: DataTypes.INTEGER,
      field: "id_cartao",
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      field: "id_usuario",
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      field: "descricao",
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(80),
      field: "categoria",
      allowNull: true,
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      field: "valor_total",
      allowNull: false,
    },
    numeroParcelas: {
      type: DataTypes.INTEGER,
      field: "numero_parcelas",
      allowNull: false,
      defaultValue: 1,
    },
    valorParcela: {
      type: DataTypes.DECIMAL(10, 2),
      field: "valor_parcela",
      allowNull: false,
    },
    parcelasPagas: {
      type: DataTypes.INTEGER,
      field: "parcelas_pagas",
      allowNull: false,
      defaultValue: 0,
    },
    dataCompra: {
      type: DataTypes.DATEONLY,
      field: "data_compra",
      allowNull: false,
    },
    primeiroMesRef: {
      type: DataTypes.DATEONLY,
      field: "primeiro_mes_ref",
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      field: "ativo",
      allowNull: false,
      defaultValue: true,
    },
    criadoEm: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    atualizadoEm: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "cartao_lancamentos",
    timestamps: false,
  }
);
