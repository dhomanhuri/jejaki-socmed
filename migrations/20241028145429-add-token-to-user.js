module.exports = {
    up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                "Users", // table name
                "isVerified", // new field name
                { type: Sequelize.BOOLEAN, defaultValue: false }
            ),
            queryInterface.addColumn(
                "Users", // table name
                "verificationToken", // new field name
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                }
            ),
        ]);
    },

    down(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn("Users", "isVerified"),
            queryInterface.removeColumn("Users", "verificationToken"),
        ]);
    },
};
