"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class PostVote extends Model {
    static associate(models) {}
  }
  PostVote.init(
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
      vote: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "PostVote",
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: "vote",
          fields: ["vote"],
        },
      ],
    }
  );

  return PostVote;
};
