"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/index.js")[env];
const db = {};
let sequelize;

// if (process.env.NODE_ENV === "production") {
if (config.use_env_variable) {
  console.log("ifffff ");
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, { host: config.host, dialect: config.dialect });
  console.log("database connected");
}
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

db.users = require("./users")(sequelize, Sequelize);
db.followers = require("./followers")(sequelize, Sequelize);
db.subs = require("./subs")(sequelize, Sequelize);
db.posts = require("./posts")(sequelize, Sequelize);
db.post_votes = require("./post_votes")(sequelize, Sequelize);
db.comments = require("./comments")(sequelize, Sequelize);
db.comment_votes = require("./comment_votes")(sequelize, Sequelize);
db.category = require("./categories")(sequelize, Sequelize);
db.subs_categories = require("./subs_categories")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// (async () => {
//   await sequelize.sync({ alter: true }).then(() => {
//     process.exit();
//   });
//   console.log("All models were synchronized successfully.");
// })();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
