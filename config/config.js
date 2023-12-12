require("dotenv").config();
module.exports = {
  development: {
    username: "postgres",
    password: "pass@271",
    database: "db_seva",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME,
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME,
    host: "127.0.0.1",
    dialect: "postgres"
  }
};
