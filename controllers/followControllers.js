const model = require("../models/index");
const jwt = require("jsonwebtoken");

const follow = async (req, res) => {
    const { username } = req.params;
    const currentUser = req.user.user;

    try {
        const userToFollow = await model.User.findOne({ where: { username } });
        const userData = await model.User.findByPk(currentUser.id);

        if (!userToFollow) {
            return res.status(404).json({ error: "User not found" });
        }

        // Buat relasi follow
        await userData.addFollowing(userToFollow);
        res.redirect(`/${username}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error following user" });
    }
};
const unfollow = async (req, res) => {
    const { username } = req.params;
    const currentUser = req.user.user;

    try {
        const userToUnfollow = await model.User.findOne({ where: { username } });
        const userData = await model.User.findByPk(currentUser.id);

        if (!userToUnfollow) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hapus relasi follow
        await userData.removeFollowing(userToUnfollow);
        res.redirect(`/${username}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
};
module.exports = { follow, unfollow };
