const router = require("express").Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Users");
const { passwordToHash, passwordToDec, generateAccessToken, generateRefreshToken, getPublicUser } = require("../scripts/utils/helper");

router.post("/signup", validate(schemas.createValidation), async (req, res, next) => {
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const oldUser = await users.findOne({ where: { email: email } });
  if (oldUser) {
    return res.status(httpStatus.CONFLICT).json({ message: "User Already Exist. Please Login" });
  }
  try {
    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
    };

    await users
      .create(newUser)
      .then((data) => {
        res.status(httpStatus.CREATED).json(getPublicUser(data));
      })
      .catch((err) => {
        return next(new ApiError(err?.message, err?.code));
      });
    // isVerified: false,
    // emailToken: crypto.randomBytes(64).toString('hex'),
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

router.post("/signin", validate(schemas.loginValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await users.findOne({ where: { email: email } }).then(async (user) => {
      if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found!" });
      // && user.isVerified
      user.password = await bcrypt.hash(user.password, 10);
      console.log("password :>> ", password);
      console.log("user :>> ", user.password);
      if (bcrypt.compareSync(password, user.password)) {
        getPublicUser(user);
        res.status(httpStatus.OK).json({
          ...user?.dataValues,
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).json({ message: "incorrect email or password!" });
      }
    });
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

router.get("/me", authenticateToken, (req, res, next) => {
  res.status(httpStatus.OK).json(getPublicUser(req.user));
});

// router.get('/verify-email', authenticateToken, async (req, res, next) => {
// 	try {
// 		const token = req.query.token;
// 		const user = await users.findOne({ emailToken: token });
// 		console.log('token :>> ', token);
// 		if (user) {
// 			user.emailToken = null;
// 			user.isVerified = true;
// 			await user.save();
// 			res.status(httpStatus.OK).json({ msg: 'verified email' });
// 		}
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// });

module.exports = router;
