const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require(".././error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Category");
const httpStatus = require("http-status");
const { category, subs_categories, posts, subs } = require("../models");

//GET TAG
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const getAll = await category.findAll();
    const allTag = getAll.map((x) => x.get({ plain: true }));
    const sortedTag = allTag.filter((e, i) => {
      return i < 5;
    });
    // limit : 5
    res.status(httpStatus.OK).json(sortedTag);
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});
//POST TAG

router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  const { name, sub_id } = req.body;
  try {
    const checkCategory = await category.findOne({ where: { name: name } });

    if (checkCategory === null) {
      const createCategory = await category.create({
        name: name.toLowerCase(),
      });
      const newTag = createCategory.get({ plain: true });

      let newCorrelationModel = await subs_categories.create({
        category_id: newTag.id,
        subs_id: sub_id,
      });

      res.status(httpStatus.CREATED).json(newCorrelationModel);
    } else {
      const checkSubCategory = await subs_categories.findOne({
        where: {
          category_id: checkCategory.dataValues.id,
          subs_id: sub_id,
        },
      });
      if (!checkSubCategory) {
        let createNewCorrelation = await subs_categories.create({
          category_id: checkCategory.dataValues.id,
          subs_id: sub_id,
        });
        res.status(httpStatus.CREATED).json(createNewCorrelation);
      } else {
        return next(new ApiError("Can't add the same tag", 404));
      }
    }
  } catch (err) {
    return next(new ApiError(err?.message, err?.code));
  }
});

module.exports = router;
