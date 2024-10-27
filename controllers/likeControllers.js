const model = require("../models/index");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const posts = await model.Post.findAll({
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: ["user"] },
            ],
            order: [["id", "DESC"]],
        });
        const isLoggedin = req.cookies.token != undefined ? true : false;

        res.render("index", { posts, title: "home", isLoggedin, user: req.user });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error fetching posts" });
    }
};
module.exports = { index };
