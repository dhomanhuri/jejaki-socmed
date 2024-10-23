"use strict";
const { Model } = require("sequelize");
// models/post.js
// models/post.js
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {});

  Post.associate = function(models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });

    // Relasi one-to-many dengan Comment
    Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });

    // Relasi one-to-many dengan Like
    Post.hasMany(models.Like, { foreignKey: 'post_id', as: 'likes', onDelete: 'CASCADE' });
  };

  return Post;
};
