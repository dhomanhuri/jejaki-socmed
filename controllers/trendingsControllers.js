const model = require("../models/index");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { default: axios } = require("axios");

const index = async (req, res) => {
    {
        try {
            const trendingHashtags = await model.Post.findAll({
                attributes: ["hashtags", [sequelize.fn("COUNT", sequelize.col("hashtags")), "count"]],
                group: "hashtags",
                order: [[sequelize.fn("COUNT", sequelize.col("hashtags")), "DESC"]],
                limit: 10,
            });

            const trending = trendingHashtags.map((post) => post.hashtags).filter((tag) => tag !== null);
            const arrTrendings = [];
            trending.forEach((post) => {
                post.split(",").forEach((tag) => {
                    arrTrendings.push(tag);
                });
            });
            res.json(arrTrendings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching trending hashtags" });
        }
    }
};
const hashtag = async (req, res) => {
    const { hashtag } = req.params; // Ambil hashtag dari parameter rute

    try {
        // Cari postingan yang mengandung hashtag tertentu
        const posts = await model.Post.findAll({
            where: {
                hashtags: {
                    [Op.like]: `%${hashtag}%`, // Mencocokkan hashtag
                },
            },

            include: [
                { model: model.User, as: "user" },
                { model: model.Like, as: "likes" },
                { model: model.Comment, as: "comments", include: ["user"] },
            ],
        });

        const isLoggedin = req.cookies.token != undefined ? true : false;

        const listUser = await model.User.findAll();
        const tag = await axios.get("http://localhost:3311/trendings");
        const hashtagList = tag.data;
        console.log(req.user);

        res.render("indextrending", { posts, title: "home", isLoggedin, user: req.user, listUser, hashtagList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching posts" });
    }
};
module.exports = { index, hashtag };
