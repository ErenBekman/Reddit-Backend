const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Category");
const httpStatus = require("http-status");
const { category, CategoryToPost, posts, users } = require("../models");

//GET TAG
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const getAll = await category.findAll();
    const allTag = getAll.map((x) => x.get({ plain: true }));
    const sortedTag = allTag.filter((e, i) => {
      return i < 5;
    });
    // limit : 5
    res.status(httpStatus.OK).send(sortedTag);
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
//POST TAG

router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  const { name, post_id } = req.body;
  try {
    const checkTag = await category.findOne({ where: { name: name } });

    if (checkTag === null) {
      const createTag = await category.create({
        name: name.toLowerCase(),
      });
      const newTag = createTag.get({ plain: true });
      console.log("newTag :>> ", newTag);

      let newCorrelationModel = await CategoryToPost.create({
        categoryId: newTag.id,
        postId: post_id,
      });

      console.log(`NEW CATEGORY TO NEW POST, CATEGORY ID:${newTag.id}`);
      res.status(httpStatus.CREATED).send(newCorrelationModel);
    } else {
      const existingTagId = checkTag.dataValues.id;
      const checkConnection = await CategoryToPost.findOne({
        where: {
          categoryId: existingTagId,
          postId: post_id,
        },
      });
      if (!checkConnection) {
        let createNewCorrelation = await CategoryToPost.create({
          categoryId: existingTagId,
          postId: post_id,
        });
        res.status(httpStatus.CREATED).send(createNewCorrelation);
      } else {
        return next(new ApiError("Can't add the same tag", 404));
      }
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
//GET POSTS BY TAG
router.get("/:id/getPost", authenticateToken, async (req, res, next) => {
  const { id } = req.params;
  try {
    const getPostsByTag = await category.findOne({
      where: { id: id },
      include: [{ model: posts, as: "posts" }],
    });

    const tagName = getPostsByTag.dataValues.name;

    const postArr = getPostsByTag.posts.map((singlePost) => {
      const Post = singlePost.dataValues;
      const otherTags = singlePost.CategoryPost;

      // const userName = singlePost.user.dataValues.username;
      // const userImage = singlePost.user.dataValues.image;

      return { Post, otherTags };
    });
    return res.status(httpStatus.OK).send([tagName, ...postArr]);
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
//GET CATEGORY BY POST
router.get("/:id/getCategory", authenticateToken, async (req, res, next) => {
  const { id } = req.params;
  console.log("id :>> ", id);
  try {
    const getPost = await posts.findByPk(id, {
      include: [{ model: category }],
    });

    const tagArr = getPost.categories.map((singleTag) => {
      return { id: singleTag.dataValues.id, name: singleTag.dataValues.name };
    });

    res.status(httpStatus.OK).send(tagArr);
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
//DELETE POST
router.delete("/", authenticateToken, async (req, res, next) => {
  const { category_id, post_id } = req.body;
  try {
    const deleteTagAssociation = await CategoryToPost.destroy({
      where: {
        categoryId: category_id,
        postId: post_id,
      },
    });

    const findResidualAssociate = await CategoryToPost.findAll({
      where: {
        categoryId: category_id,
      },
    });

    if (findResidualAssociate.length === 0) {
      const deleteTag = await category.destroy({
        where: {
          id: category_id,
        },
      });
      return res.status(httpStatus.OK).send(deleteTagAssociation);
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
