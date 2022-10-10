const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const events = require("./scripts/events");
const errorHandler = require("./middleware/errorHandler");
const app = express();

dotenv.config();
events();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(fileUpload());

app.use(
  cors({
    origin: "*", // http://localhost:3000
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

require("./routes/index")(app);

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

module.exports = app;
