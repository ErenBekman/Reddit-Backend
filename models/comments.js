"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.post, {
        foreignKey: "post_id",
        targetKey: "id",
        as: "post",
        constraints: false,
      });
      this.belongsTo(models.user, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
        constraints: false,
      });
      this.hasMany(models.comment, {
        foreignKey: "parent_id",
        sourceKey: "id",
        as: "comment",
        constraints: false,
      });
      this.hasMany(models.CommentVote, {
        foreignKey: "comment_id",
        sourceKey: "id",
        as: "CommentVote",
        constraints: false,
      });
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "comment",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: "content",
          fields: ["content"],
        },
      ],
    }
  );

  return Comment;
};
