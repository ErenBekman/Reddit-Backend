const httpStatus = require("http-status");
const { UserModel } = require("../models");
const CryptoJS = require("crypto-js");
const eventEmitter = require(".././scripts/events/eventEmitter");

class User {
  async index(req, res) {
    const query = req.query.new;
    console.log("req.query :>> ", req.query);
    console.log("req.query :>> ", query);
    try {
      const users = query ? await UserModel.findAll({ order: [["id", "DESC"]] }) : await UserModel.findAll();
      res.status(httpStatus.OK).send(users);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id);
      if (!user) return res.status(httpStatus.NOT_FOUND).send({ message: "User not found" });
      const { password, ...others } = user.dataValues;
      res.status(httpStatus.OK).send(others);
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async update(req, res) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_HASH).toString();
    }
    if (!req.params.id) return res.status(httpStatus.BAD_REQUEST).send({ messages: "user id is not found!" });

    try {
      await UserModel.update(req?.body, { where: { id: req?.params?.id } })
        .then((updatedUser) => {
          if (updatedUser == 1) {
            res.status(httpStatus.OK).send({ message: "User was updated successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot update with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
          }
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async deleteUser(req, res) {
    if (!req.params.id) {
      res.status(httpStatus.NOT_FOUND).send({
        message: "user id is not found!",
      });
    }

    try {
      await UserModel.destroy({ where: { id: req?.params?.id } })
        .then((deleteUser) => {
          if (deleteUser === 1) {
            res.status(httpStatus.OK).send({ message: "User was deleted successfully." });
          } else {
            res.status(httpStatus.BAD_REQUEST).send({ message: `Cannot delete with id=${req?.params?.id}. Maybe User was not found or req.body is empty!` });
          }
        })
        .catch((err) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async follow(req, res) {
    const user = await UserModel.findByPk(req.params.id);
    const currentUser = await UserModel.findByPk(req.user.id);
    try {
      await user.update({ followers: req.user.id }, { where: { id: req.params.id } });
      // await UserModel.find({ where: { id: req.params.id } }).then((user) => {
      //   user.followers.push(req.user.id);
      //   console.log("user :>> ", user);
      //   user.update(
      //     {
      //       followers: user.followers,
      //     },
      //     {
      //       where: {
      //         id: req.params.id,
      //       },
      //     }
      //   );
      // });

      await currentUser.update({ followings: req.params.id }, { where: { id: req.user.id } });

      res.status(httpStatus.OK).json("user has been followed");
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  // async unfollow(req, res) {
  //   try {
  //     if (req.body.userId !== req.params.id) {
  //       try {
  //         const user = await User.findById(req.params.id);
  //         const currentUser = await User.findById(req.body.userId);
  //         if (user.followers.includes(req.body.userId)) {
  //           await user.updateOne({ $pull: { followers: req.body.userId } });
  //           await currentUser.updateOne({ $pull: { followings: req.params.id } });
  //           res.status(200).json("user has been unfollowed");
  //         } else {
  //           res.status(403).json("you dont follow this user");
  //         }
  //       } catch (err) {
  //         res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  //       }
  //     } else {
  //       res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  //     }
  //   } catch (err) {
  //     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  //   }
  // }

  async resetPassword(req, res) {
    // const newPassword = uuid.v4()?.split('-')[1] || `usr-${new Date.getTime()}`
    const newPassword = `usr-${new Date().getTime()}`;
    console.log("newPassword :>> ", newPassword);
    try {
      await UserModel.update({ password: newPassword }, { where: { email: req.body?.email } }).then((updatedUser) => {
        console.log("updatedUser :>> ", updatedUser);
        if (updatedUser == 1) {
          // eventEmitter.emit("send_email", {
          //   to: updatedUser.email,
          //   subject: "Password Reset ✔",
          //   html: `Your password reset process has been completed. <br /> Your new password :<b>${newPassword}</b>`,
          // });
          res.status(httpStatus.OK).send({ message: "Password is changed successfully. Please check your email" });
        } else {
          res.status(httpStatus.NOT_FOUND).send({ message: "Password already in use" });
        }
      });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  async changePassword(req, res) {
    console.log("req.user :>> ", req.user);
    await UserModel.update(req.body, { where: { id: req.user?.id } }).then((updatedUser) => {
      if (updatedUser == 1) {
        res.status(httpStatus.OK).send({ message: "Password changed successfully" });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Password not changed!" });
      }
    });
  }
  async updateProfileImage(req, res) {}
}

module.exports = new User();
