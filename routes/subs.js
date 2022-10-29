const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const ApiError = require("../error/ApiError");
const validate = require("../middleware/validate");
const schemas = require("../validations/Subs");
const httpStatus = require("http-status");
const { subs, users } = require("../models");

//SUB POST
router.post("/", authenticateToken, validate(schemas.createValidation), async (req, res, next) => {
  try {
    const newSub = await subs.create({
      ...req.body,
    });

    res.status(httpStatus.CREATED).json(newSub);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//GET ONE POST
router.get("/:name", authenticateToken, async (req, res, next) => {
  const { name } = req.params;
  if (!name) return next(new ApiError("sub name is not found!", 403));

  try {
    const sub = await subs.findOne({ where: { name: name } });
    if (!sub) return next(new ApiError("sub not found!", 403));
    res.status(httpStatus.OK).json(sub);
  } catch (err) {
    next(new ApiError(err?.message, err?.code));
  }
});

//UPDATE POST
router.patch("/:id", authenticateToken, validate(schemas.updateValidation), async (req, res, next) => {
  if (!req.params.id) return next(new ApiError("sub id is not found!", 403));

  try {
    await subs
      .update(req?.body, { where: { id: req?.params?.id } })
      .then((updatedSubs) => {
        if (updatedSubs == 1) {
          res.status(httpStatus.OK).json({ message: "Sub was updated successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot update with id = ${req?.params?.id}` });
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
  if (!req.params.id) return next(new ApiError("sub id is not found!", 403));

  try {
    await subs
      .destroy({ where: { id: req?.params?.id } })
      .then((deleteposts) => {
        if (deleteposts === 1) {
          res.status(httpStatus.OK).json({ message: "Sub was deleted successfully." });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: `Cannot delete with id = ${req?.params?.id}` });
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
