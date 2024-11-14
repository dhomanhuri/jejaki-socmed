const model = require("../models/index");

const sequelize = require("sequelize");
const { base64decode } = require("../utils/base64decode");
const { encryptdataid } = require("../utils/encryptdataid");
const { basedecrypt } = require("../utils/basedecrypt");
const Op = sequelize.Op;
const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;

        const posts = await model.Post.findAll({
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        const user = req.user;

        res.send({ status: true, data: posts, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching posts" });
    }
};
const index_following = async (req, res) => {
    // console.log(user);
    if (req.query.content) {
        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;

        const posts = await model.Post.findAll({
            where: { id: basedecrypt(req.query.content) },
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        const user = req.user;
        console.log({ posts });
        console.log(basedecrypt(req.query.content));

        const data = encryptdataid(posts);
        return res.send({ status: true, data: data, user });
    }
    if (req.query.tag) {
        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;
        const posts = await model.Post.findAll({
            where: {
                hashtags: {
                    [Op.like]: `%${req.query.tag}%`, // Mencocokkan hashtag
                },
            },

            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        const user = req.user;
        const data = encryptdataid(posts);

        return res.send({ status: true, data: data, user });
    }
    try {
        const followingIds = await model.Follow.findAll({
            where: { follower_id: req.user.user.id },
            attributes: ["following_id"],
        }).then((following) => following.map((f) => f.following_id));
        // return res.json(followingIds);
        followingIds.unshift(req.user.user.id);
        // console.log(followingIds);
        const user = req.user;
        if (followingIds.length === 0) {
            return res.json({ status: true, data: [], user });
        }
        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;

        const posts = await model.Post.findAll({
            where: { user_id: followingIds },
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });
        console.log(followingIds);

        const data = encryptdataid(posts);

        res.send({ status: true, data: data, user });
    } catch (err) {
        console.log("ini eerror");
        console.log(err);

        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;

        const posts = await model.Post.findAll({
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });
        const user = req.user;
        const data = await encryptdataid(posts);
        res.send({ status: true, data: data, user });
    }
};
const index_trending = async (req, res) => {
    try {
        const { hashtag } = req.params;
        const page = parseInt(req.query.page) || 1; // halaman ke berapa, default 1
        const limit = 10; // ambil 10 postingan per halaman
        const offset = (page - 1) * limit;

        const posts = await model.Post.findAll({
            where: {
                hashtags: {
                    [Op.like]: `%${hashtag}%`, // Mencocokkan hashtag
                },
            },
            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: [{ model: model.User, as: "user" }] },
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        const user = req.user;
        // console.log(user);
        const data = encryptdataid(posts);

        res.send({ status: true, data: data, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching posts" });
    }
};
const like = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.user.id; // Assuming you have user info in the request

    try {
        // Check if the user already liked the post
        const existingLike = await model.Like.findOne({ where: { post_id, user_id } });

        if (existingLike) {
            // If liked, remove the like (unlike)
            await existingLike.destroy();
            const likesCount = await model.Like.count({ where: { post_id } });
            return res.json({ isLiked: false, likesCount });
        } else {
            // If not liked, add a new like
            await model.Like.create({ post_id, user_id });
            const likesCount = await model.Like.count({ where: { post_id } });
            return res.json({ isLiked: true, likesCount });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};
const comment = async (req, res) => {
    const { post_id, content } = req.body;
    const user_id = req.user.user.id; // Assuming you have user info in the request

    try {
        // Create a new comment in the database
        const comment = await model.Comment.create({ post_id, user_id, content });

        // Get the username of the commenting user
        const user = await model.User.findByPk(user_id);

        return res.json({
            user: { username: user.username },
            content: comment.content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

module.exports = { index, like, comment, index_trending, index_following };
