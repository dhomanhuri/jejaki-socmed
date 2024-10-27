const express = require("express");
const router = express.Router();
const { Comment, Post, User } = require("../models");
const { isAuthenticated, auth, auth_asguest, auth_asuser } = require("../middleware/auth");

router.post("/", auth_asuser, async (req, res) => {
    console.log(req.body);
    const user_id = req.user.user.id;
    const { post_id, content } = req.body;
    try {
        const comment = await Comment.create({ user_id, post_id, content });

        res.redirect("/threads");
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error adding comment" });
    }
});

router.get("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.findAll({ where: { post_id: postId }, include: ["user"] });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: "Error fetching comments" });
    }
});

module.exports = router;
