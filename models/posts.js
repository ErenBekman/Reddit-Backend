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
      this.belongsToMany(models.category, {
        foreignKey: "postId",
        through: models.CategoryPost,
      });

      this.hasMany(models.votes, {
        foreignKey: "post_id",
        sourceKey: "id",
        as: "vote",
        constraints: false,
      });

      this.hasMany(models.comment, {
        foreignKey: "post_id",
        sourceKey: "id",
        as: "comments",
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
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      post_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // category_id: {
      //   type: DataTypes.INTEGER,
      // },
      votes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // votePercentage: {
      //   type: DataTypes.VIRTUAL,
      //   get: function () {
      //     const votes = this.getDataValue("votes");
      //     if (votes == 0) return 0;
      //     const upVotes = votes.filter((v) => v.vote == 1);
      //     return Math.floor((upVotes / votes) * 100);
      //   },
      // },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "post",
      timestamps: true,
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
