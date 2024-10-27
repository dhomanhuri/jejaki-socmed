const model = require("../models/index");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    const { username } = req.params;

    try {
        const profile = await model.User.findOne({
            where: { username },
            include: [
                { model: model.Post, as: "posts" },
                { model: model.User, as: "Followers" },
                { model: model.User, as: "Following" },
            ],
        });

        if (!profile) {
            return res.status(404).send("User not found");
        }

        const isLoggedin = req.cookies.token != undefined ? true : false;
        let userData;
        if (isLoggedin) {
            userData = await model.User.findByPk(req.user.user.id, {
                include: [
                    { model: model.Post, as: "posts" },
                    { model: model.User, as: "Followers" },
                    { model: model.User, as: "Following" },
                ],
            });
        }

        const userList = await model.User.findAll();
        const hashtags = ["#saya", "#makan", "#babi"];
        res.render("profile", { hashtags, profile, user: req.user, isLoggedin, userData, userList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error loading profile" });
    }
};
const edit = async (req, res) => {
    const isLoggedin = req.cookies.token != undefined ? true : false;
    res.render("editProfile", { user: req.user, isLoggedin });
};
const update = async (req, res) => {
    const { username, bio, profile_picture } = req.body;
    const currentUser = req.user.user;

    try {
        await model.User.update({ username, bio, profile_picture }, { where: { id: currentUser.id } });
        res.redirect(`/${username}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating profile" });
    }
};
module.exports = { index, edit, update };
