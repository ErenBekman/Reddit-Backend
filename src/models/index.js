const UserModel = require("./Users");
const PostModel = require("./Posts");
const LikeModel = require("./Like");
const CommentModel = require("./Comment");
const TagModel = require("./Tag");
const TagToPostModel = require("./TagToPost");

// User : Posts ****************************************************************

UserModel.hasMany(PostModel, {
  foreignKey: "user_id",
});

PostModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

// Tag : Post ****************************************************************

PostModel.belongsToMany(TagModel, {
  foreignKey: "post_id",
  through: TagToPostModel,
});
TagModel.belongsToMany(PostModel, {
  foreignKey: "tag_id",
  through: TagToPostModel,
});

// Likes : Post : User ****************************************************************

PostModel.hasMany(LikeModel, {
  foreignKey: "post_id",
});

LikeModel.belongsTo(PostModel, {
  foreignKey: "post_id",
});

LikeModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});

UserModel.hasMany(LikeModel, {
  foreignKey: "user_id",
});

// Comment : Post : User ****************************************************************

PostModel.hasMany(CommentModel, {
  foreignKey: "post_id",
});

CommentModel.belongsTo(PostModel, {
  foreignKey: "post_id",
});

CommentModel.belongsTo(UserModel, {
  foreignKey: "user_id",
});

UserModel.hasMany(CommentModel, {
  foreignKey: "user_id",
});

// Follower : User  ****************************************************************

// Follower.belongsTo(UserModel, {
//     foreignKey: 'follower_id',
//   });

//   UserModel.hasMany(Follower, {
//     foreignKey: 'follower_id',
//   });

module.exports = { UserModel, PostModel, LikeModel, CommentModel, TagModel, TagToPostModel };
