const { default: axios } = require("axios");
const model = require("../models/index");
const jwt = require("jsonwebtoken");

const redirect_root = (req, res) => {
    res.redirect("/threads");
};
const index = async (req, res) => {
    try {
        // const posts = await model.Post.findAll({
        //     include: [
        //         { model: model.User, as: "user" },
        //         { model: model.Like, as: "likes" },
        //         { model: model.Comment, as: "comments", include: ["user"] },
        //     ],
        //     order: [["id", "DESC"]],
        // });
        const isLoggedin = req.cookies.token != undefined ? true : false;

        const listUser = await model.User.findAll();
        const tag = await axios.get("http://localhost:3311/trendings");

        const hashtagList = tag.data;

        console.log(req.user);
        res.render("index", { title: "home", isLoggedin, user: req.user, listUser, hashtagList });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error fetching posts" });
    }
};
const post = async (req, res) => {
    try {
        const isLoggedin = req.cookies.token != undefined ? true : false;

        res.render("createPost", { isLoggedin, user: req.user });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error fetching posts" });
    }
};
const poststore = async (req, res) => {
    try {
        var { content, image } = req.body;
        const user_id = req.user.user.id;
        const hashtagRegex = /#(\w+)/g;
        const hashtagsraw = content.match(hashtagRegex); // Mencocokkan semua hashtag

        const hashtags = hashtagsraw ? hashtagsraw.join(",").replace(/#/g, "") : null; // Menghilangkan karakter '#' dari hasil
        console.log(image);
        image = image.replace("https://youtu.be/", "https://youtube.com/embed/");
        image = image.replace("https://m.youtube.com/watch?v=", "https://youtube.com/embed/");
        image = image.replace("watch?v=", "embed/");
        await model.Post.create({
            content,
            image,
            hashtags,
            user_id,
        });
        res.redirect("/threads");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating post" });
    }
};
module.exports = { index, post, poststore, redirect_root };
