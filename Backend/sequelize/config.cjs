module.exports = {
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: Number(process.env.DB_PORT_PROD || 3306),
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
  },
};
