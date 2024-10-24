var express = require("express");
var router = express.Router();
const likeControllers = require("../controllers/likeControllers");
const { isAuthenticated, auth, auth_asguest, auth_asuser } = require("../middleware/auth");

router.get("/:postId", auth_asuser, likeControllers.index);
module.exports = router;


// const express = require("express");
// const router = express.Router();
// const model = require("../models");
// const { isAuthenticated } = require("../middlewares/auth");

// // Like a post
// router.post("/:postId", isAuthenticated, async (req, res) => {
//     const { postId } = req.params;
//     const userId = req.user.id;

//     try {
//         // Cek apakah user sudah like post ini
//         const existingLike = await Like.findOne({ where: { postId, userId } });

//         if (existingLike) {
//             // Jika sudah like, hapus like (unlike)
//             await Like.destroy({ where: { postId, userId } });
//         } else {
//             // Jika belum, buat like baru
//             await Like.create({ postId, userId });
//         }

//         res.redirect("/");
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Error liking post" });
//     }
// });

// module.exports = router;
