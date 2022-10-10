module.exports = function (app) {
  // require('./auth')(app)
  app.use("/api/auth", require("./auth"));
  app.use("/api/users", require("./users"));
  app.use("/api/posts", require("./posts"));
  app.use("/api/comments", require("./comments"));
  app.use("/api/votes", require("./votes"));
  app.use("/api/categories", require("./category"));
};
