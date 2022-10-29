"use strict";
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class CommentVote extends Model {
    static associate(models) {}
  }
  CommentVote.init(
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
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vote: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[-1, 1]],
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CommentVote",
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

  return CommentVote;
};
