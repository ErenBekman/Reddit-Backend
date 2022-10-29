const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Comment");
const httpStatus = require("http-status");
const { posts, users, comments, comment_votes } = require("../models");

//POST COMMENT
router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  try {
    const newComment = await comments.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(httpStatus.CREATED).json(newComment);
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

//GET ONE COMMENT
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await comments.findByPk(id, {
      include: [
        {
          model: users,
          as: "user",
          attributes: ["id", "username"],
        },

        {
          model: comment_votes,
          as: "CommentVote",
          attributes: ["id", "vote"],
        },
      ],
    });
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ message: "Command not found" });
    res.status(httpStatus.OK).json(post);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//UPDATE COMMENT
router.patch("/:id", authenticateToken, validate(schemas.updateValidation), async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("comment id is not found!", 403));

  try {
    await comments
      .update(req?.body, { where: { id: req?.params?.id } })
      .then((updatedPost) => {
        if (updatedPost == 1) {
          res.status(httpStatus.OK).json({ message: "Commend was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot update with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//DELETE COMMENT
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("comment id is not found!", 403));

  try {
    await comments
      .destroy({ where: { id: req?.params?.id } })
      .then((deleteComment) => {
        if (deleteComment === 1) {
          res.status(httpStatus.OK).json({ message: "Comment was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot delete with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET USER COMMENT
router.get("/user/:user_id", authenticateToken, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await comments.findAll({
      include: [
        {
          model: users,
          as: "user",
          attributes: ["id", "username", "email"],
          where: { id: user_id },
        },
      ],
    });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
    res.status(httpStatus.OK).json(user);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET POST COMMENT
router.get("/post/:post_id", authenticateToken, async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const post = await comments.findAll({
      include: [
        {
          model: posts,
          as: "post",
          attributes: ["id", "title"],
          where: { id: post_id },
        },
      ],
    });
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ message: "post not found" });
    res.status(httpStatus.OK).json(post);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
