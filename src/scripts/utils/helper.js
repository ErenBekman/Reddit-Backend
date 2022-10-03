const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
// const crypto = require('crypto');

const passwordToHash = (password) => {
  // return CryptoJS.HmacSHA256(password, CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString();
  return CryptoJS.AES.encrypt(password, process.env.PASSWORD_HASH).toString();
};

const passwordToDec = (password) => {
  return CryptoJS.AES.decrypt(password, process.env.PASSWORD_HASH).toString();
};

const generateAccessToken = (user) => {
  return JWT.sign({ id: user.id }, process.env.PASSWORD_HASH, {
    expiresIn: "1w",
  });
};

const generateRefreshToken = (user) => {
  return JWT.sign({ id: user.id }, process.env.REFRESH_HASH);
};

const getPublicUser = (user) => {
  delete user.dataValues.password;
  // delete user.tokens
  return user;
};

module.exports = {
  passwordToHash,
  passwordToDec,
  generateAccessToken,
  generateRefreshToken,
  getPublicUser,
};
