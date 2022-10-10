const { sequelize } = require("./models");
const { exec } = require("child_process");

(async () => {
  await sequelize.sync({ alter: true }).then(() => {
    process.exit();
  });
  console.log("All models were synchronized successfully.");
})();
