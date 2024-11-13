var express = require("express");
var router = express.Router();
const postsControllers = require("../controllers/postControllers");
const authControllers = require("../controllers/authControllers");
const { auth_asguest, auth_asuser, auth_asuser_api } = require("../middleware/auth");

router.get("/posts", auth_asguest, postsControllers.index);
router.get("/posts_following", auth_asguest, postsControllers.index_following);
router.get("/trending/:hashtag", auth_asguest, postsControllers.index_trending);
router.post("/like", auth_asuser_api, postsControllers.like);
router.post("/comment", auth_asuser_api, postsControllers.comment);

router.get("/verify-email", authControllers.verified_mail);
module.exports = router;
