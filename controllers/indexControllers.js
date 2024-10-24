const model = require("../models/index");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        // console.log("ini session");
        // console.log(req.session);
        // console.log("ini coockies");
        // console.log(req.cookies.token);
        // console.log(req.user);

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
const post = async (req, res) => {
    try {
        console.log("ini session");
        console.log(req.session);
        console.log("ini coockies");
        console.log(req.cookies.token);
        console.log(req.user);

        const isLoggedin = req.cookies.token != undefined ? true : false;

        res.render("createPost", { isLoggedin, user: req.user }); // Menampilkan halaman form untuk membuat post
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error fetching posts" });
    }
};
const poststore = async (req, res) => {
    try {
        const { content, image } = req.body;
        const user_id = req.user.user.id; // Ambil userId dari session atau token

        // Buat post baru
        console.log("ini user");
        console.log(req.user.user.id);

        console.log({ content, user_id });

        await model.Post.create({
            content,
            image, // Jika ada gambar
            user_id, // Menyimpan ID user yang membuat post
        });
        res.redirect("/threads"); // Redirect ke halaman home setelah post berhasil dibuat
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating post" });
    }
    // const { content, image } = req.body;
    // const userId = req.user.id; // Ambil userId dari session atau token

    // try {
    //     await model.Post.create({
    //         content,
    //         image, // Jika ada gambar
    //         userId, // Menyimpan ID user yang membuat post
    //     });
    //     res.redirect("/threads"); // Redirect ke halaman home setelah post berhasil dibuat
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: "Error creating post" });
    // }
};
module.exports = { index, post, poststore };
