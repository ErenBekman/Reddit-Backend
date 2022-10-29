"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class SubsCategory extends Model {
    static associate(models) {
      this.hasMany(models.category, {
        foreignKey: "category_id",
        sourceKey: "id",
        as: "category",
        constraints: false,
      });
      this.hasMany(models.subs, {
        foreignKey: "subs_id",
        sourceKey: "id",
        as: "subs",
        constraints: false,
      });
    }
  }
  SubsCategory.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
      subs_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SubsCategory",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [],
    }
  );

  return SubsCategory;
};
