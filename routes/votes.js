const router = require("express").Router();
const httpStatus = require("http-status");
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const { votes, posts } = require("../models");
const { checkVoteType } = require("../scripts/utils/helper");

//POST LIKE
router.post("/:postId/up", authenticateToken, async (req, res, next) => {
  const { postId } = req.params;
  const { voteType } = req.query;
  const user_id = req.user.id;
  let voteTypeError = checkVoteType(voteType);
  if (voteTypeError) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: voteTypeError });
  }

  try {
    const result = await votes.findOne({
      where: { user_id: user_id, post_id: postId },
    });

    console.log("result :>> ", result);

    if (!result) {
      await votes.create({ user_id: user_id, post_id: postId }).then(async () => {
        await posts.increment("votes", { by: 1, where: { id: postId } });
      });
      res.status(httpStatus.CREATED).send({ like: true, message: `successfully liked post id:${postId}` });
    } else {
      await votes.destroy({ where: result.dataValues });
      res.status(httpStatus.BAD_REQUEST).send({ message: `not voted post id:${postId}` });
    }

    // } else {
    //   await votes.destroy({ where: result.dataValues });
    //   res.status(httpStatus.OK).send({ like: false, message: `successfully unliked post id:${postId}` });
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
router.post("/:postId/down", authenticateToken, async (req, res, next) => {
  const { postId } = req.params;
  const user_id = req.user.id;
  try {
    const result = await votes.findOne({
      where: { user_id: user_id, post_id: postId },
    });

    if (result) {
      await votes.create({ user_id: user_id, post_id: postId }).then(async () => {
        await posts.increment("votes", { by: -1, where: { id: postId } });
      });
      res.status(httpStatus.CREATED).send({ unlike: true, message: `successfully unliked post id:${postId}` });
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
