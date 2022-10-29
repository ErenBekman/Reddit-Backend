module.exports = function (app) {
  // require('./auth')(app)
  app.use("/api/auth", require("./auth"));
  app.use("/api/users", require("./users"));
  app.use("/api/posts", require("./posts"));
  app.use("/api/comments", require("./comments"));
  app.use("/api/post_votes", require("./post_votes"));
  app.use("/api/comment_votes", require("./comment_votes"));
  app.use("/api/categories", require("./category"));
  app.use("/api/subs", require("./subs"));
  app.use("/api/followers", require("./follower"));
};
