const { Model, DataTypes } = require("sequelize");

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    title: { type: DataTypes.STRING },
    textContent: { type: DataTypes.STRING },
    post_image: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "https://bulma.io/images/placeholders/128x128.png",
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
