const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require("../error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Posts");
const httpStatus = require("http-status");
const { posts, users, post_votes, comments } = require("../models");
const { Sequelize, Op } = require("sequelize");

//GET ALL COMMENTS
router.get("/", authenticateToken, async (req, res, next) => {
  const { key } = req.query;
  try {
    await posts
      .findAll({
        where: {
          title: { [Sequelize.Op.like]: "%" + key + "%" },
        },
        include: [
          {
            model: users,
            as: "user",
            attributes: ["id", "username", "email"],
          },
        ],
        order: [["created_at", "DESC"]],
        limit: 50,
      })
      .then((comment) => {
        res.status(httpStatus.OK).json(comment);
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET USER POST
router.get("/user", authenticateToken, async (req, res, next) => {
  try {
    const post = await posts.findAll({
      user_id: req.user.id,
      include: [
        {
          model: users,
          as: "user",
          attributes: ["username", "email"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(httpStatus.OK).json(post);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//POST POST
router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  try {
    const newPost = await posts.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(httpStatus.CREATED).json(newPost);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET ONE POST
router.get("/:id", authenticateToken, async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ApiError("post id is not found!", 403));

  try {
    const post = await posts.findByPk(id, {
      include: [
        {
          model: users,
          as: "user",
          attributes: ["username", "email"],
        },
      ],
    });
    if (!post) return next(new ApiError("post not found!", 403));
    res.status(httpStatus.OK).json(post);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//UPDATE POST
router.patch("/:id", authenticateToken, validate(schemas.updateValidation), async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("post id is not found!", 403));

  try {
    await posts
      .update(req?.body, { where: { id: req?.params?.id } })
      .then((updatedPost) => {
        if (updatedPost == 1) {
          res.status(httpStatus.OK).json({ message: "Post was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot update with id=${req?.params?.id}. Maybe posts was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//DELETE POST
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("post id is not found!", 403));

  try {
    await posts
      .destroy({ where: { id: req?.params?.id } })
      .then((deleteposts) => {
        if (deleteposts === 1) {
          res.status(httpStatus.OK).json({ message: "Post was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot delete with id=${req?.params?.id}. Maybe posts was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//POST COMMENT
router.get("/:id/comments", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("comment is not found!", 403));

  try {
    await comments
      .findAll({ where: { post_id: req?.params?.id } })
      .then((commentpost) => {
        res.status(httpStatus.OK).json(commentpost);
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
