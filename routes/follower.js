const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require("../error/ApiError");
const httpStatus = require("http-status");
const { subs, followers } = require("../models");

//SUB FOLLOW
router.post("/:subsname/follow", authenticateToken, async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const sub = await subs.findOne({ where: { name: req?.params?.subsname } });
    if (!sub) return res.status(httpStatus.BAD_REQUEST).json("sub is not found!");

    const newFollow = await followers.create({
      user_id: user_id,
      subs_id: sub.id,
    });

    res.status(httpStatus.CREATED).json(newFollow);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//SUB UNFOLLOW
router.post("/:subsname/unfollow", authenticateToken, async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const sub = await subs.findOne({ where: { name: req?.params?.subsname } });
    if (!sub) return res.status(httpStatus.BAD_REQUEST).json("sub is not found!");

    const newFollow = await followers
      .destroy({
        where: {
          user_id: user_id,
          subs_id: sub.id,
        },
      })
      .then((unfollowSub) => {
        if (unfollowSub === 1) {
          res.status(httpStatus.OK).json({ message: "Sub was unfollowed successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot unfollowed with id = ${req?.params?.id}` });
        }
      });

    res.status(httpStatus.CREATED).json(newFollow);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
