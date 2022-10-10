const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Users");
const httpStatus = require("http-status");
const { users } = require("../models");
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
    res.status(httpStatus.OK).send(allUser);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//GET ONE USER
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findByPk(id);
    if (!user) return res.status(httpStatus.NOT_FOUND).send({ message: "User not found" });
    const { password, ...others } = user.dataValues;
    res.status(httpStatus.OK).send(others);
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
          res.status(httpStatus.OK).send({ message: "User was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
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
          res.status(httpStatus.OK).send({ message: "User was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
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
    await user.update({ followers: req.user.id }, { where: { id: req.params.id } });
    // await users.find({ where: { id: req.params.id } }).then((user) => {
    //   user.followers.push(req.user.id);
    //   console.log("user :>> ", user);
    //   user.update(
    //     {
    //       followers: user.followers,
    //     },
    //     {
    //       where: {
    //         id: req.params.id,
    //       },
    //     }
    //   );
    // });

    await currentUser.update({ followings: req.params.id }, { where: { id: req.user.id } });

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
        res.status(httpStatus.OK).send({ message: "Password is changed successfully. Please check your email" });
      } else {
        res.status(httpStatus.NOT_FOUND).send({ message: "Password already in use" });
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
      res.status(httpStatus.OK).send({ message: "Password changed successfully" });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Password not changed!" });
    }
  });
});
//UPDATE PROFILE IMAGE
router.post("/update-profile-image", authenticateToken, async (req, res, next) => {});

module.exports = router;
