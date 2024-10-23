"use strict";
const { Model } = require("sequelize");
// models/follow.js
module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define(
        "Follow",
        {
            followed_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {}
    );

    return Follow;
};
