const httpStatus = require("http-status");
const { PostModel, UserModel, TagModel } = require("../models");

class Post {
  async index(req, res) {
    const query = req.query.new;
    try {
      const PostModels = query
        ? await PostModel.findAll({
            include: [
              {
                model: UserModel,
                as: "user",
                attributes: { exclude: ["password", "email"] },
              },
            ],
            order: [["id", "DESC"]],
          })
        : await PostModel.findAll({
            include: [
              {
                model: UserModel,
                as: "user",
                attributes: { exclude: ["password", "email"] },
              },
            ],
          });
      res.status(httpStatus.OK).send(PostModels);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  async create(req, res) {
    try {
      const newPost = await PostModel.create({
        ...req.body,
        user_id: req.user.id,
      });

      res.status(httpStatus.CREATED).send(newPost);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const post = await PostModel.findByPk(id, {
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: { exclude: ["password", "email"] },
          },
        ],
      });
      if (!post) return res.status(httpStatus.NOT_FOUND).send({ message: "Post not found" });
      res.status(httpStatus.OK).send(post);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async getUserPost(req, res) {
    try {
      console.log("functionnnn ");
      console.log("req.user :>> ", req.user.id);

      const postsByUser = await UserModel.findByPk(req.user.id, {
        attributes: { exclude: ["password", "email"] },
        include: [
          {
            model: PostModel,
            required: true,
            // include: [
            //   { model: UserModel },
            //   {
            //     model: TagModel,
            //   },
            //   // {
            //   //   model: LikeModel,
            //   // },
            // ],
          },
        ],
      });

      if (postsByUser.dataValues.id !== null) {
        const postArray = postsByUser.dataValues.posts;

        const userPost = {
          userName: req.user.username,
          postArray,
          userImage: postsByUser.dataValues.image,
        };

        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(userPost);
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "no post found" });
      }
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async update(req, res) {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ messages: "PostModel id is not found!" });

    try {
      console.log("req.body :>> ", req.body);
      await PostModel.update(req?.body, { where: { id: req?.params?.id } })
        .then((updatedPost) => {
          if (updatedPost == 1) {
            res.status(httpStatus.OK).send({ message: "Post was updated successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe PostModel was not found or req.body is empty!` });
          }
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async deletePost(req, res) {
    if (!req.params.id) {
      res.status(httpStatus.NOT_FOUND).send({
        message: "PostModel id is not found!",
      });
    }

    try {
      await PostModel.destroy({ where: { id: req?.params?.id } })
        .then((deletePostModel) => {
          if (deletePostModel === 1) {
            res.status(httpStatus.OK).send({ message: "Post was deleted successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe PostModel was not found or req.body is empty!` });
          }
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}

module.exports = new Post();
