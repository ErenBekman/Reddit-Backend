const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Users");
const httpStatus = require("http-status");
const { users, comments } = require("../models");
const CryptoJS = require("crypto-js");
const eventEmitter = require(".././scripts/events/eventEmitter");

//GET ALL USER
router.get("/", authenticateToken, async (req, res, next) => {
  const query = req.query.new;
  try {
    const allUser = query
      ? await users.findAll({
          order: [
            ["id", "DESC"],
            ["username", "ASC"],
          ],
        })
      : await users.findAll();
    res.status(httpStatus.OK).json(allUser);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//GET ONE USER
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findByPk(id);
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    const { password, ...others } = user.dataValues;
    res.status(httpStatus.OK).json(others);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//UPDATE USER
router.patch("/:id", authenticateToken, validate(schemas.updateValidation), async (req, res, next) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_HASH).toString();
  }
  if (!req.params.id) return next(new ApiError("user id is not found!", 403));

  try {
    await users
      .update(req?.body, { where: { id: req?.params?.id } })
      .then((updatedUser) => {
        if (updatedUser == 1) {
          res.status(httpStatus.OK).json({ message: "User was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot update with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//DELETE USER
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("user id is not found!", 403));
  try {
    await users
      .destroy({ where: { id: req?.params?.id } })
      .then((deleteUser) => {
        if (deleteUser === 1) {
          res.status(httpStatus.OK).json({ message: "User was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot delete with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//FOLLOW USER
router.patch("/:id/follow", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("user id is not found!", 403));
  const user = await users.findByPk(req.params.id);
  const currentUser = await users.findByPk(req.user.id);
  try {
    res.status(httpStatus.OK).json("user has been followed");
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//UNFOLLOW USER
router.patch("/:id/unfollow", authenticateToken, async (req, res, next) => {});
//RESET PASSWORD
router.post("/reset-password", validate(schemas.resetPasswordValidation), async (req, res, next) => {
  // const newPassword = uuid.v4()?.split('-')[1] || `usr-${new Date.getTime()}`
  const newPassword = `usr-${new Date().getTime()}`;
  console.log("newPassword :>> ", newPassword);
  try {
    await users.update({ password: newPassword }, { where: { email: req.body?.email } }).then((updatedUser) => {
      console.log("updatedUser :>> ", updatedUser);
      if (updatedUser == 1) {
        // eventEmitter.emit("send_email", {
        //   to: updatedUser.email,
        //   subject: "Password Reset ✔",
        //   html: `Your password reset process has been completed. <br /> Your new password :<b>${newPassword}</b>`,
        // });
        res.status(httpStatus.OK).json({ message: "Password is changed successfully. Please check your email" });
      } else {
        res.status(httpStatus.NOT_FOUND).json({ message: "Password already in use" });
      }
    });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//CHANGE PASSWORD
router.post("/change-password", authenticateToken, validate(schemas.changePasswordValidation), async (req, res, next) => {
  await users.update(req.body, { where: { id: req.user?.id } }).then((updatedUser) => {
    if (updatedUser == 1) {
      res.status(httpStatus.OK).json({ message: "Password changed successfully" });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Password not changed!" });
    }
  });
});
//UPDATE PROFILE IMAGE
router.post("/update-profile-image", authenticateToken, async (req, res, next) => {});
//PROFILE NAME
router.get("/u/:profile", authenticateToken, async (req, res, next) => {
  if (!req.params.profile) return next(new ApiError("user is not found!", 403));

  try {
    await users
      .findOne({ where: { username: req?.params?.profile } })
      .then((userprofile) => {
        res.status(httpStatus.OK).json(userprofile);
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//PROFILE COMMENTS
router.get("/u/:profile/comments", authenticateToken, async (req, res, next) => {
  if (!req.params.profile) return next(new ApiError("user is not found!", 403));

  try {
    const user = await users.findOne({ where: { username: req?.params?.profile } });
    if (!user) return res.status(httpStatus.BAD_REQUEST).json("user is not found!");

    await comments
      .findAll({ where: { user_id: user.id } })
      .then((usercomment) => {
        res.status(httpStatus.OK).json(usercomment);
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
