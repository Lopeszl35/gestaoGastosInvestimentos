import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class CartaoCreditoModel extends Model {}

CartaoCreditoModel.init(
  {
    idCartao: {
      type: DataTypes.INTEGER,
      field: "id_cartao",
      primaryKey: true,
      autoIncrement: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      field: "id_usuario",
      allowNull: false,
    },
    uuid_cartao: {
      type: DataTypes.CHAR(36),
      field: "uuid",
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(80),
      field: "nome",
      allowNull: false,
    },
    ultimos4: {
      type: DataTypes.CHAR(4),
      field: "ultimos_4",
      allowNull: true,
    },
    bandeira: {
      type: DataTypes.STRING(30),
      field: "bandeira",
      allowNull: true,
    },
    limite: {
      type: DataTypes.DECIMAL(10, 2),
      field: "limite",
      allowNull: false,
      defaultValue: 0.0,
    },
    diaFechamento: {
      type: DataTypes.TINYINT,
      field: "dia_fechamento",
      allowNull: false,
    },
    diaVencimento: {
      type: DataTypes.TINYINT,
      field: "dia_vencimento",
      allowNull: false,
    },
    corHex: {
      type: DataTypes.STRING(7),
      field: "cor_hex",
      allowNull: true,
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
    tableName: "cartoes_credito",
    timestamps: false,
  }
);
