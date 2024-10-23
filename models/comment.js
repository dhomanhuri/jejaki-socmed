"use strict";
const { Model } = require("sequelize"); // models/comment.js
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {}
    );

    // Relasi antara Comment dan User serta Post
    Comment.associate = function (models) {
        Comment.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
        });
        Comment.belongsTo(models.Post, {
            foreignKey: "post_id",
            as: "post",
            onDelete: "CASCADE",
        });
    };

    return Comment;
};
