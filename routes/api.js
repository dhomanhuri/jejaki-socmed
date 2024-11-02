var express = require("express");
var router = express.Router();
const postsControllers = require("../controllers/postControllers");
const { auth_asguest, auth_asuser } = require("../middleware/auth");

router.get("/posts", auth_asguest, postsControllers.index);
router.get("/trending/:hashtag", auth_asguest, postsControllers.index_trending);
router.post("/like", auth_asuser, postsControllers.like);
router.post("/comment", auth_asuser, postsControllers.comment);

module.exports = router;
