"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class CategoryToPost extends Model {
    static associate(models) {
      this.hasMany(models.category, {
        foreignKey: "categoryId",
        sourceKey: "id",
        as: "category",
        constraints: false,
      });
      this.hasMany(models.posts, {
        foreignKey: "postId",
        sourceKey: "id",
        as: "post",
        constraints: false,
      });
    }
  }
  CategoryToPost.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      postId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "CategoryPost",
      timestamps: true,
      paranoid: true,
      indexes: [],
    }
  );

  return CategoryToPost;
};
