const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const LikeController = require("../controllers/LikeController");

//POST LIKE
router.route("/:postId").post(authenticateToken, LikeController.likePost);

module.exports = router;
