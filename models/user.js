"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            profile_picture: DataTypes.STRING,
            bio: DataTypes.TEXT,
            verificationToken: DataTypes.TEXT,
            isVerified: DataTypes.BOOLEAN,
        },
        {}
    );

    User.associate = function (models) {
        User.hasMany(models.Post, { foreignKey: "user_id", as: "posts", onDelete: "CASCADE" });
        User.hasMany(models.Comment, { foreignKey: "user_id", as: "comments", onDelete: "CASCADE" });
        User.hasMany(models.Like, { foreignKey: "user_id", as: "likes", onDelete: "CASCADE" });

        User.belongsToMany(models.User, {
            through: "Follow",
            as: "Followers",
            foreignKey: "following_id",
        });
        User.belongsToMany(models.User, {
            through: "Follow",
            as: "Following",
            foreignKey: "follower_id",
        });
    };

    return User;
};
