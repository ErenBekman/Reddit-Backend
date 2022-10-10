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
    //     account_id: 'd5205d653810cc0f2389e4afbb6b5736',
    //     account_hash: 'NB4OkmH0399eQQDu6nR2ZA',
    //     token: 'Y6vOUa9NjgKf9VbtYiSgfMFpF4TKFqL0j9kSWLHi'
    //   },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    secret: "Reddit_2022?",
    //   cloudflare: {
    //     account_id: 'd5205d653810cc0f2389e4afbb6b5736',
    //     account_hash: 'NB4OkmH0399eQQDu6nR2ZA',
    //     token: 'Y6vOUa9NjgKf9VbtYiSgfMFpF4TKFqL0j9kSWLHi'
    //   },
  },
};

configs.config = configs[env];
module.exports = configs;

// {
//   "development": {
//     "USER": "root",
//     "PASSWORD": "root",
//     "DB": "reddit",
//     "HOST": "127.0.0.1",
//     "DIALECT": "mysql"
//   },
//   "test": {
//     "USER": "root",
//     "PASSWORD": null,
//     "DB": "database_test",
//     "HOST": "127.0.0.1",
//     "DIALECT": "mysql"
//   },
//   "production": {
//     "USER": "root",
//     "PASSWORD": null,
//     "DB": "database_production",
//     "HOST": "127.0.0.1",
//     "DIALECT": "mysql"
//   }
// }
