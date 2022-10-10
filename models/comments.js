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
        foreignKey: "parent_comment_id",
        sourceKey: "id",
        as: "comments",
        constraints: false,
      });

      this.hasMany(models.votes, {
        foreignKey: "vote_id",
        sourceKey: "id",
        as: "vote",
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
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      vote_id: {
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
