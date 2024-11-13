var express = require("express");
var router = express.Router();
const indexControllers = require("../controllers/indexControllers");
const trandingsControllers = require("../controllers/trendingsControllers");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");
const { auth_asguest, auth_asuser } = require("../middleware/auth");
const model = require("../models/index");
const { Like, Post, User } = require("../models");

router.get("/trendings", trandingsControllers.index);
router.get("/trending/tag", auth_asguest, trandingsControllers.hashtag);
router.get("/threads", auth_asguest, indexControllers.index);
router.get("/threads/post", auth_asuser, indexControllers.post);
router.post("/threads/post", auth_asuser, indexControllers.poststore);
router.get("/", indexControllers.index);
router.get("/:username", auth_asguest, userControllers.index);
router.get("/account/edit", auth_asuser, userControllers.edit);
router.post("/account/update", auth_asuser, userControllers.update);

router.post("/unlike", auth_asuser, async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.user.id;

    try {
        const dataLike = await Like.findOne({
            where: { post_id, user_id },
        });
        await dataLike.destroy();

        res.redirect("/threads");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error unliking post" });
    }
});

module.exports = router;
