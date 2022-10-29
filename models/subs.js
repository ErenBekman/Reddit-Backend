"use strict";

module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class Subs extends Model {
    static associate(models) {}
  }
  Subs.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "subs",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: "name",
          fields: ["name"],
        },
      ],
    }
  );

  return Subs;
};
