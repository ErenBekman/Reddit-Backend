const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const loaders = require("./loaders");
const events = require("./scripts/events");
const errorHandler = require("./middleware/errorHandler");

// * ROUTES --------------------------------

const { UserRoutes, AuthRoutes, PostRoutes, CommentRoutes, TagRoutes, LikeRoutes } = require("./routes");

// * END ROUTES ------------------------------
dotenv.config();
loaders();
events();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(logger("dev"));
app.use(fileUpload());

// * CORS --------------------------------
app.use(
  cors({
    origin: "*", // http://localhost:3000
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// * END CORS --------------------------------

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/tags", TagRoutes);
app.use("/api/likes", LikeRoutes);

app.use((req, res, next) => {
  const error = new Error("The page you were looking for could not be found..");
  error.status = 404;
  next(error);
});

// !error handler
app.use(errorHandler);

app.listen(process.env.APP_PORT || 8080, process.env.HOST || "0.0.0.0", () => {
  console.log(`Server is listening on http://localhost:${process.env.APP_PORT}/`);
});
