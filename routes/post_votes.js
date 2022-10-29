const router = require("express").Router();
const httpStatus = require("http-status");
const authenticateToken = require("../middleware/authenticate");
const ApiError = require("../error/ApiError");
const { post_votes, posts } = require("../models");

//POST VOTE
router.post("/", authenticateToken, async (req, res, next) => {
  const { post_id, direction } = req.body;
  const user_id = req.user.id;

  const isVoted = await post_votes.findOne({
    where: { user_id: user_id, post_id: post_id },
  });

  try {
    if (!isVoted) {
      newVote = {
        user_id: user_id,
        post_id: post_id,
        vote: direction === "up" ? 1 : -1,
      };
      await post_votes.create(newVote);

      await posts.update({ vote_count: newVote.vote }, { where: { id: post_id } });

      res.json(`voted up | post id : ${post_id}`);
    } else {
      direction === "up" ? await isVoted.increment({ vote: 1 }, { where: { id: isVoted.id } }) : await isVoted.decrement({ vote: 1 }, { where: { id: isVoted.id } });
      let directionNumber = direction === "up" ? 1 : -1;
      await posts.update({ vote_count: isVoted.vote + directionNumber }, { where: { id: post_id } });
      res.json(`voted ${direction} | post id : ${post_id}`);
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
