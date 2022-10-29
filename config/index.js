require("dotenv").config();
const env = process.env.NODE_ENV || "development";

const configs = {
  development: {
    username: process.env.MYSQL_USERNAME || "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || "3306",
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    secret: "secret",
    logging: true,
    timezone: "+00:00",
    url: "http://localhost:3005",
    app: {
      url: "http://localhost:3000",
      ios: "http://localhost:3000",
      android: "http://localhost:3000",
    },
    //   cloudflare: {
    //     account_id: '',
    //     account_hash: '',
    //     token: ''
    //   },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    secret: "Reddit_2022?",
    //   cloudflare: {
    //     account_id: '',
    //     account_hash: '',
    //     token: ''
    //   },
  },
};

configs.config = configs[env];
module.exports = configs;
