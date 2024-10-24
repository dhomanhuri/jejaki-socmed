var express = require("express");
var router = express.Router();
const indexControllers = require("../controllers/indexControllers");
const { isAuthenticated, auth, auth_asguest, auth_asuser } = require("../middleware/auth");

router.get("/threads", auth_asguest, indexControllers.index);
router.get("/threads/post", auth_asuser, indexControllers.post);
router.post("/threads/post", auth_asuser, indexControllers.poststore);
router.get("/", indexControllers.index);
module.exports = router;
