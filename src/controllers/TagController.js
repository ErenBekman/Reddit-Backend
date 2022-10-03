const httpStatus = require("http-status");
const { TagModel, TagToPostModel, PostModel, UserModel } = require("../models");

class Tag {
  async index(req, res) {
    try {
      const getAll = await TagModel.findAll();
      const allTag = getAll.map((x) => x.get({ plain: true }));
      console.log("allTag :>> ", allTag);
      const sortedTag = allTag.filter((e, i) => {
        return i < 5;
      });
      // limit : 5
      res.status(httpStatus.OK).send(sortedTag);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async create(req, res) {
    const { title, post_id } = req.body;
    try {
      const checkTag = await TagModel.findOne({ where: { title: title } });

      if (checkTag === null) {
        const createTag = await TagModel.create({
          title: title.toLowerCase(),
        });
        const newTag = createTag.get({ plain: true });

        let newCorrelationModel = await TagToPostModel.create({
          tag_id: newTag.id,
          post_id: post_id,
        });

        console.log(`NEW TAG TO NEW POST, TAG ID:${newTag.id}`);
        res.status(httpStatus.CREATED).send(newCorrelationModel);
      } else {
        const existingTagId = checkTag.dataValues.id;
        const checkConnection = await TagToPostModel.findOne({
          where: {
            tag_id: existingTagId,
            post_id: post_id,
          },
        });
        if (!checkConnection) {
          let createNewCorrelation = await TagToPostModel.create({
            tag_id: existingTagId,
            post_id: post_id,
          });
          res.status(httpStatus.CREATED).send(createNewCorrelation);
        } else {
          res.status(httpStatus.BAD_REQUEST).send({ message: "Can't add the same tag" });
        }
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  async getPostsByTag(req, res) {
    const { id } = req.params;
    try {
      const getPostsByTag = await TagModel.findOne({
        where: { id: id },
        include: [
          {
            model: PostModel,
            include: [
              //   { model: UserModel },
              { model: TagModel },
            ],
          },
        ],
      });

      const tagName = getPostsByTag.dataValues.title;

      const postArr = getPostsByTag.posts.map((singlePost) => {
        const thisPost = singlePost.dataValues;
        // const userName = singlePost.user.dataValues.username;
        // const userImage = singlePost.user.dataValues.image;

        const otherTags = singlePost.tags.map((singleTag) => {
          return {
            tagId: singleTag.dataValues.id,
            tagTitle: singleTag.dataValues.title,
          };
        });

        return { thisPost, otherTags };
      });
      return res.status(httpStatus.OK).send(postArr);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async getTagsByPost(req, res) {
    const { id } = req.params;
    try {
      const getPost = await PostModel.findByPk(id, {
        include: TagModel,
      });

      const tagArr = getPost.tags.map((singleTag) => {
        return { id: singleTag.dataValues.id, title: singleTag.dataValues.title };
      });

      res.status(httpStatus.OK).send(tagArr);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async deleteTag(req, res) {
    const { tag_id, post_id } = req.body;
    try {
      const deleteTagAssociation = await TagToPostModel.destroy({
        where: {
          tag_id: tag_id,
          post_id: post_id,
        },
      });

      const findResidualAssociate = await TagToPostModel.findAll({
        where: {
          tag_id: tag_id,
        },
      });

      if (findResidualAssociate.length === 0) {
        const deleteTag = await TagModel.destroy({
          where: {
            id: tag_id,
          },
        });
        return res.status(httpStatus.OK).send(deleteTagAssociation);
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}

module.exports = new Tag();
