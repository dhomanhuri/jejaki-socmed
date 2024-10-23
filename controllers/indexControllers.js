const model = require("../models/index");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    // try {
    //     res.render("index", { title: "Home Page" });
    //     // let data = model.Todo.findAll();
    //     // if (!data) {
    //     //     throw "data kosong";
    //     // }
    //     // res.status(200).send({
    //     //     data: data,
    //     //     message: "success",
    //     // });
    // } catch (error) {
    //     console.log(error);
    // }

    try {
        const posts = await model.Post.findAll({
            include: [
                { model: User, as: "user" },
                { model: Like, as: "likes" },
                { model: Comment, as: "comments", include: ["user"] },
            ],
        });
        res.render("index", { posts, title: "home" });
    } catch (err) {
        res.status(500).json({ error: "Error fetching posts" });
    }
};
module.exports = { index };
