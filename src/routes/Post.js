const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const schemas = require("../validations/Posts");
const PostController = require("../controllers/PostControllers");

//GET ALL POST
router.route("/").get(authenticateToken, PostController.index);
//GET USER POST
router.route("/user").get(authenticateToken, PostController.getUserPost);
//POST POST
router.route("/").post(authenticateToken, validate(schemas.createValidation), PostController.create);
//GET ONE POST
router.route("/:id").get(authenticateToken, PostController.show);
//UPDATE POST
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), PostController.update);
//DELETE POST
router.route("/:id").delete(authenticateToken, PostController.deletePost);

module.exports = router;
