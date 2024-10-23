var express = require("express");
var router = express.Router();
const indexControllers = require("../controllers/indexControllers");

router.get("/threads", indexControllers.index);
router.get("/", indexControllers.index);
module.exports = router;
