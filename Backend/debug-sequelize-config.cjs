require("dotenv").config();

const cfg = require("./sequelize/config.cjs");

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("ENV production vars:", {
  DB_HOST_PROD: process.env.DB_HOST_PROD,
  DB_PORT_PROD: process.env.DB_PORT_PROD,
  DB_USER_PROD: process.env.DB_USER_PROD,
  DB_NAME_PROD: process.env.DB_NAME_PROD,
});

console.log("Config.production:", cfg.production);
