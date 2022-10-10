"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Category extends Model {
    static associate(models) {
      this.belongsToMany(models.post, {
        foreignKey: "categoryId",
        through: models.CategoryPost,
      });
    }
  }
  Category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "category",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "name",
          fields: ["name"],
        },
      ],
    }
  );

  return Category;
};
