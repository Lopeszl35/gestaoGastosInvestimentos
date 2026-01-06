import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize.js";

export class CartaoFaturaModel extends Model {}

CartaoFaturaModel.init(
  {
    idFatura: {
      type: DataTypes.INTEGER,
      field: "id_fatura",
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
    ano: {
      type: DataTypes.INTEGER,
      field: "ano",
      allowNull: false,
    },
    mes: {
      type: DataTypes.TINYINT,
      field: "mes",
      allowNull: false,
    },
    totalLancamentos: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_lancamentos",
      allowNull: false,
      defaultValue: 0.0,
    },
    totalPago: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_pago",
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("aberta", "fechada", "paga"),
      field: "status",
      allowNull: false,
      defaultValue: "aberta",
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
    tableName: "cartao_faturas",
    timestamps: false,
  }
);
