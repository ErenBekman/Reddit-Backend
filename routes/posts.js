const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Posts");
const httpStatus = require("http-status");
const { posts, users } = require("../models");

//GET ALL POST
router.get("/", authenticateToken, async (req, res, next) => {
  const query = req.query.new;
  try {
    const post = query
      ? await posts.findAll({
          include: [
            {
              model: users,
              as: "user",
              // attributes: { exclude: ["password", "email"] },
              attributes: ["username", "email"],
            },
          ],
          order: [["id", "DESC"]],
        })
      : await posts.findAll({
          include: [
            {
              model: users,
              as: "user",
              attributes: { exclude: ["password", "email"] },
            },
          ],
        });
    res.status(httpStatus.OK).send(post);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});
//GET USER POST
router.get("/user", authenticateToken, async (req, res, next) => {
  try {
    const postsByUser = await users.findByPk(req.user.id, {
      include: [
        {
          model: posts,
          as: "post",
          required: true,
          attributes: ["id", "title", "content", "post_image", "votes", "createdAt"],
          include: [{ model: users, as: "user", attributes: ["username", "email"] }],
        },
      ],
    });

    if (postsByUser.dataValues.id !== null) {
      const postArray = postsByUser.dataValues.post;

      const userPost = {
        username: req.user.username,
        picture: postsByUser.dataValues.picture,
        postArray,
      };
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(userPost);
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "no post found" });
    }
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

    res.status(httpStatus.CREATED).send(newPost);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET ONE POST
router.get("/:id", authenticateToken, async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("post id is not found!", 403));
  const { id } = req.params;

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
    res.status(httpStatus.OK).send(post);
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
          res.status(httpStatus.OK).send({ message: "Post was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe posts was not found or req.body is empty!` });
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
          res.status(httpStatus.OK).send({ message: "Post was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe posts was not found or req.body is empty!` });
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
