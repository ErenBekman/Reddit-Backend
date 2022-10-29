const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");
const { users } = require("../models");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // const token = req.headers?.authorization?.split(" ")[1] || null
  if (token === null) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: "please first you have to login" });
  }

  JWT.verify(token, process.env.PASSWORD_HASH, async (err, user) => {
    if (err) return res.status(httpStatus.FORBIDDEN).json({ error: err });
    req.user = await users.findOne({ where: { id: user.id } });
    next();
  });
};

module.exports = authenticateToken;
