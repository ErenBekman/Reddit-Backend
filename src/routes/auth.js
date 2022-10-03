const router = require("express").Router();
const { UserModel } = require("../models");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const authenticateToken = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const schemas = require("../validations/Users");
const { passwordToHash, passwordToDec, generateAccessToken, generateRefreshToken, getPublicUser } = require("../scripts/utils/helper");

router.post("/register", validate(schemas.createValidation), async (req, res) => {
  const { username, email, password } = req.body;
  // const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(password, salt);
  const oldUser = await UserModel.findOne({ email });
  if (oldUser) {
    return res.status(httpStatus.CONFLICT).send({ message: "User Already Exist. Please Login" });
  }
  let user = await UserModel.findOne({ where: { email: email, username: username } });
  if (user) return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "User found" });
  try {
    const newUser = {
      username: username,
      email: email,
      password: password,
    };

    await UserModel.create(newUser)
      .then((data) => {
        res.status(httpStatus.CREATED).json(getPublicUser(data));
      })
      .catch((err) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      });
    // isVerified: false,
    // emailToken: crypto.randomBytes(64).toString('hex'),
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

router.post("/signup", validate(schemas.loginValidation), async (req, res) => {
  try {
    const { email, password } = req.body;
    await UserModel.findOne({ where: { email: email } }).then(async (user) => {
      if (!user) return res.status(httpStatus.NOT_FOUND).send({ message: "User not found!" });
      // && user.isVerified

      if (bcrypt.compareSync(password, user.password)) {
        getPublicUser(user);
        res.status(httpStatus.OK).send({
          ...user?.dataValues,
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({ message: "incorrect password or email!" });
      }
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// router.get('/verify-email', authenticateToken, async (req, res) => {
// 	try {
// 		const token = req.query.token;
// 		const user = await UserModel.findOne({ emailToken: token });
// 		console.log('token :>> ', token);
// 		if (user) {
// 			user.emailToken = null;
// 			user.isVerified = true;
// 			await user.save();
// 			res.status(httpStatus.OK).send({ msg: 'verified email' });
// 		}
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// });

router.get("/me", authenticateToken, (req, res) => {
  res.status(httpStatus.OK).send(getPublicUser(req.user));
});

module.exports = router;
