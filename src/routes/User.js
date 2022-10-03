const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const schemas = require("../validations/Users");
const UserController = require("../controllers/UserControllers");

//GET ALL USER
router.route("/").get(authenticateToken, UserController.index);
//GET ONE USER
router.route("/:id").get(authenticateToken, UserController.show);
//UPDATE USER
router.route("/:id").patch(authenticateToken, validate(schemas.updateValidation), UserController.update);
//DELETE USER
router.route("/:id").delete(authenticateToken, UserController.deleteUser);
//FOLLOW USER
router.route("/:id/follow").patch(authenticateToken, UserController.follow);
//UNFOLLOW USER
// router.route("/:id/unfollow").patch(authenticateToken, UserController.unfollow);
//RESET PASSWORD
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), UserController.resetPassword);
//CHANGE PASSWORD
router.route("/change-password").post(authenticateToken, validate(schemas.changePasswordValidation), UserController.changePassword);
//UPDATE PROFILE IMAGE
router.route("/update-profile-image").post(authenticateToken, UserController.updateProfileImage);

module.exports = router;
