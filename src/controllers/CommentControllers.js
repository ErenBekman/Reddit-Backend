const httpStatus = require("http-status");
const { CommentModel, UserModel, PostModel } = require("../models");

class Comment {
  async index(req, res) {
    const query = req.query.new;
    try {
      const comment = query
        ? await CommentModel.findAll({
            order: [["id", "DESC"]],
          })
        : await CommentModel.findAll({
            include: [
              //   {
              //     model: UserModel,
              //     as: "user",
              //     attributes: { exclude: ["password", "email"] },
              //   },
              {
                model: PostModel,
                as: "post",
                include: [
                  {
                    model: UserModel,
                    as: "user",
                    attributes: { exclude: ["password", "email"] },
                  },
                ],
              },
            ],
          });
      res.status(httpStatus.OK).send(comment);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  async create(req, res) {
    try {
      const newComment = await CommentModel.create({
        ...req.body,
        user_id: req.user.id,
      });

      res.status(httpStatus.CREATED).send(newComment);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const post = await CommentModel.findByPk(id, {
        include: [
          {
            model: PostModel,
            as: "post",
            include: [
              {
                model: UserModel,
                as: "user",
                attributes: { exclude: ["password", "email"] },
              },
            ],
          },
        ],
      });
      if (!post) return res.status(httpStatus.NOT_FOUND).send({ message: "Command not found" });
      res.status(httpStatus.OK).send(post);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async update(req, res) {
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ messages: "Comment id is not found!" });

    try {
      await CommentModel.update(req?.body, { where: { id: req?.params?.id } })
        .then((updatedPost) => {
          if (updatedPost == 1) {
            res.status(httpStatus.OK).send({ message: "Commend was updated successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
          }
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async deleteComment(req, res) {
    if (!req.params.id) {
      res.status(httpStatus.NOT_FOUND).send({
        message: "Comment id is not found!",
      });
    }

    try {
      await CommentModel.destroy({ where: { id: req?.params?.id } })
        .then((deleteComment) => {
          if (deleteComment === 1) {
            res.status(httpStatus.OK).send({ message: "Comment was deleted successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe Comment was not found or req.body is empty!` });
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

module.exports = new Comment();
