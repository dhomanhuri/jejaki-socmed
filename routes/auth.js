var express = require("express");
var router = express.Router();
const authControllers = require("../controllers/authControllers");

router.get("/signin", authControllers.signin);
router.post("/signin", authControllers.signinpost);
router.get("/signup", authControllers.signup);
router.post("/signup", authControllers.signuppost);
module.exports = router;
