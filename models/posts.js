"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
        constraints: false,
      });
      this.hasMany(models.comment, {
        foreignKey: "post_id",
        sourceKey: "id",
        as: "comments",
        constraints: false,
      });
      this.hasMany(models.PostVote, {
        foreignKey: "post_id",
        sourceKey: "id",
        as: "PostVote",
        constraints: false,
      });
    }
  }
  Post.init(
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
      sub_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      type: {
        type: DataTypes.ENUM({
          values: ["text", "image"],
        }),
      },
      vote_count: {
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "post",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: "title",
          fields: ["title"],
        },
      ],
    }
  );

  return Post;
};
