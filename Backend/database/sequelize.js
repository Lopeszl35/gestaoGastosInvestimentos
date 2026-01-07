import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME_PROD,
  process.env.DB_USER_PROD,
  process.env.DB_PASS_PROD,
  {
    host: process.env.DB_HOST_PROD,
    port: Number(process.env.DB_PORT_PROD ?? 3306),
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export async function testarConexaoSequelize() {
  await sequelize.authenticate();
  console.log("✅ Sequelize conectado ao banco com sucesso!");
}
