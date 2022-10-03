const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const schemas = require("../validations/Tags");
const TagController = require("../controllers/TagController");

//GET TAG
router.route("/").get(authenticateToken, TagController.index);
//POST TAG
router.route("/").post(authenticateToken, validate(schemas.createValidation), TagController.create);
//GET POSTS BY TAG
router.route("/:id/getPost").get(authenticateToken, TagController.getPostsByTag);
//GET TAGS BY POST
router.route("/:id/getTags").get(authenticateToken, TagController.getTagsByPost);
//DELETE POST
router.route("/").delete(authenticateToken, TagController.deleteTag);

module.exports = router;
