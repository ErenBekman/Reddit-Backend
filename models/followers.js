"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Follower extends Model {
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
        constraints: false,
      });
    }
  }
  Follower.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      subs_id: {
        type: DataTypes.INTEGER,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "follower",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [],
    }
  );

  return Follower;
};
