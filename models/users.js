"use strict";
const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
  const Model = Sequelize.Model;
  const DataTypes = Sequelize.DataTypes;
  class User extends Model {
    static associate(models) {
      this.hasMany(models.post, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "post",
        constraints: false,
      });

      this.hasMany(models.vote, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "vote",
        constraints: false,
      });

      this.hasMany(models.comment, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "comment",
        constraints: false,
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      email_verified_at: {
        default: null,
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3],
        },
      },
      // tokens: {
      //   type: DataTypes.STRING,
      // },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM({
          values: ["f", "m"],
        }),
      },
      followers: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      followings: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      deletedAt: "deletedAt",
      modelName: "user",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "email",
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    return user;
  });
  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return user;
  });

  return User;
};
