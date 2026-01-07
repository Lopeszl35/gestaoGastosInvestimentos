import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize.js";
import { v4 as uuidv4 } from "uuid";

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
      field: "uuid_cartao",
      allowNull: false,
      unique: true,
      defaultValue: () => uuidv4(),

    },
    nome: {
      type: DataTypes.STRING(80),
      field: "nome",
      allowNull: false,
    },
    ultimos4: {
      type: DataTypes.CHAR(4),
      field: "ultimos4",
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
    nomeNorm: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "nome_norm",
    },
    bandeiraNorm: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "bandeira_norm",
    },
    ultimos4Norm: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: "ultimos4_norm",
    },
  },
  {
    sequelize,
    tableName: "cartoes_credito",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    hooks: {
      beforeValidate: (instance) => {
        const nome = String(instance.nome ?? "").trim().toLowerCase();
        const bandeira = String(instance.bandeira ?? "").trim().toLowerCase();
        const ultimos4 = String(instance.ultimos4 ?? "").trim();

        if (!instance.nomeNorm) instance.nomeNorm = nome.toLowerCase();
        if (!instance.bandeiraNorm) instance.bandeiraNorm = bandeira.toLowerCase();
        if (!instance.ultimos4Norm) instance.ultimos4Norm = ultimos4; // não precisa lower
      }
    }
  }
);
