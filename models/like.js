"use strict";
const { Model } = require("sequelize"); // models/like.js
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {}, {});

    // Relasi antara Like dan User serta Post
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
    // models/like.js
    // module.exports = (sequelize, DataTypes) => {
    //     const Like = sequelize.define("Like", {
    //         userId: {
    //             type: DataTypes.INTEGER,
    //             allowNull: false,
    //         },
    //         postId: {
    //             type: DataTypes.INTEGER,
    //             allowNull: false,
    //         },
    //     });

    //     Like.associate = (models) => {
    //         Like.belongsTo(models.User, { foreignKey: "userId" });
    //         Like.belongsTo(models.Post, { foreignKey: "postId" });
    //     };

    //     return Like;
    // };
};
