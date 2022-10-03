const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(config.development.DB, config.development.USER, config.development.PASSWORD, {
  host: config.development.HOST,
  dialect: config.development.DIALECT,
  // operatorsAliases: false,
});

sequelize
  .sync()
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = sequelize;
global.sequelize = sequelize;
