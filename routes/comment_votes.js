const router = require("express").Router();
const httpStatus = require("http-status");
const authenticateToken = require("../middleware/authenticate");
const ApiError = require("../error/ApiError");
const { comment_votes, comments } = require("../models");

//COMMENT VOTE
router.post("/", authenticateToken, async (req, res, next) => {
  const { comment_id, direction } = req.body;
  const user_id = req.user.id;

  const isVoted = await comment_votes.findOne({
    where: { user_id: user_id, comment_id: comment_id },
  });

  try {
    if (!isVoted) {
      newVote = {
        user_id: user_id,
        comment_id: comment_id,
        vote: direction === "up" ? 1 : -1,
      };
      await comment_votes.create(newVote);

      // await comments.update({ vote_count: newVote.vote }, { where: { id: comment_id } });

      res.json(`voted up | comment id : ${comment_id}`);
    } else {
      direction === "up" ? await isVoted.increment({ vote: 1 }, { where: { id: isVoted.id } }) : await isVoted.decrement({ vote: 1 }, { where: { id: isVoted.id } });
      let directionNumber = direction === "up" ? 1 : -1;
      // await comments.update({ vote_count: isVoted.vote + directionNumber }, { where: { id: comment_id } });
      res.json(`voted ${direction} | comment id : ${comment_id}`);
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
