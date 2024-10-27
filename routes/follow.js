const express = require("express");
const router = express.Router();
const { auth_asuser } = require("../middleware/auth");

const followControllers = require("../controllers/followControllers");
router.post("/follow/:username", auth_asuser, followControllers.follow);

router.post("/unfollow/:username", auth_asuser, followControllers.unfollow);

module.exports = router;
