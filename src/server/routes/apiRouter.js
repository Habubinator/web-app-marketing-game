const Router = require("express");
const controller = require("../controllers/apiController.js");
const router = new Router();

// Route to ping that user is online
router.post("/online", controller.online);

// Route to auth existing or init new user
router.post("/auth", controller.auth);

module.exports = router;
