const model = require("../models/index");

const sequelize = require("sequelize");
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
        console.log(user);

        res.send({ status: true, data: posts, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching posts" });
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
        console.log(user);

        res.send({ status: true, data: posts, user });
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

module.exports = { index, like, comment, index_trending };
