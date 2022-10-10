const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Comment");
const httpStatus = require("http-status");
const { posts, users, comments } = require("../models");
const { Sequelize, Op } = require("sequelize");

//GET ALL COMMENTS
router.get("/", authenticateToken, async (req, res, next) => {
  const { key } = req.query;
  try {
    await comments
      .findAll({
        where: {
          content: { [Sequelize.Op.like]: "%" + key + "%" },
        },
        include: [
          {
            model: users,
            as: "user",
            attributes: ["id", "username", "email", "picture"],
          },
          {
            model: posts,
            as: "post",
            attributes: ["id", "title", "content", "post_image", "votes", "createdAt"],
            include: [
              {
                model: users,
                as: "user",
                attributes: ["id", "username", "email", "picture"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 50,
      })
      .then((comment) => {
        res.status(httpStatus.OK).send(comment);
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//POST COMMENT
router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  try {
    const newComment = await comments.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(httpStatus.CREATED).send(newComment);
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
          model: posts,
          as: "post",
          attributes: ["id", "votePercentage", "title", "content", "post_image", "votes", "createdAt"],
          include: [
            {
              model: users,
              as: "user",
              attributes: ["id", "username", "email", "picture"],
            },
          ],
        },
      ],
    });
    if (!post) return res.status(httpStatus.NOT_FOUND).send({ message: "Command not found" });
    res.status(httpStatus.OK).send(post);
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
          res.status(httpStatus.OK).send({ message: "Commend was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
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
          res.status(httpStatus.OK).send({ message: "Comment was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
        }
      })
      .catch((err) => {
        next(new ApiError(err?.message, err?.code));
      });
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
