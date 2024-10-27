const express = require("express");
const router = express.Router();
const { Like, Post, User } = require("../models");
const { auth_asuser } = require("../middleware/auth");

router.post("/", auth_asuser, async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.user.id;
    try {
        const like = await Like.create({ user_id, post_id });

        res.redirect("/threads");
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error liking post" });
    }
});

// router.post('/unlike', async (req, res) => {
//     const { postId } = req.body;
//     const userId = req.user.id;

//     try {
//       // Hapus like jika user telah like sebelumnya
//       await Like.destroy({
//         where: { postId, userId }
//       });
//       res.redirect('/');
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Error unliking post' });
//     }
//   });
router.get("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const likes = await Like.findAll({ where: { post_id: postId }, include: ["user"] });
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({ error: "Error fetching likes" });
    }
});

module.exports = router;
