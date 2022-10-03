const httpStatus = require("http-status");
const { LikeModel } = require("../models");

class Like {
  async likePost(req, res) {
    const { postId } = req.params;
    const user_id = req.user.id;
    try {
      const result = await LikeModel.findOne({
        where: { user_id: user_id, post_id: postId },
      });

      if (!result) {
        await LikeModel.create({ user_id: user_id, post_id: postId });
        res.status(httpStatus.CREATED).send({ like: true, message: `successfully liked post id:${postId}` });
      } else {
        await LikeModel.destroy({ where: result.dataValues });
        res.status(httpStatus.OK).send({ like: false, message: `successfully unliked post id:${postId}` });
      }
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}

module.exports = new Like();
