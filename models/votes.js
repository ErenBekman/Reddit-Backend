"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Vote extends Model {
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
      this.belongsTo(models.comment, {
        foreignKey: "comment_id",
        targetKey: "id",
        as: "comment",
        constraints: false,
      });
    }
  }
  Vote.init(
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
        allowNull: false,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "vote",
      timestamps: true,
      paranoid: true,
      indexes: [],
    }
  );

  return Vote;
};
