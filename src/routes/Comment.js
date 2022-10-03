const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const schemas = require("../validations/Comment");
const CommentController = require("../controllers/CommentControllers");

//GET ALL COMMENTS
router.route("/").get(authenticateToken, CommentController.index);
//POST COMMENT
router.route("/").post(authenticateToken, validate(schemas.createValidation), CommentController.create);
//GET ONE COMMENT
router.route("/:id").get(authenticateToken, CommentController.show);
//UPDATE COMMENT
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), CommentController.update);
//DELETE COMMENT
router.route("/:id").delete(authenticateToken, CommentController.deleteComment);

module.exports = router;
// router.route("/").get(validate(schemas.createValidation), CommentController.index);
