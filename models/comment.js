"use strict";
const { Model } = require("sequelize");
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
