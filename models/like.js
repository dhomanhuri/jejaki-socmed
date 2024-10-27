"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {}, {});

    Like.associate = function (models) {
        Like.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
        });
        Like.belongsTo(models.Post, {
            foreignKey: "post_id",
            as: "post",
            onDelete: "CASCADE",
        });
    };

    return Like;
};
