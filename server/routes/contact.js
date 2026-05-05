const express           = require("express");
const router            = express.Router();
const contactController = require("../controllers/contactController");
const { authenticate }  = require("../middleware/auth");

router.post("/",           contactController.sendMessage);
router.get("/",            authenticate, contactController.getMessages);
router.patch("/:id/read",  authenticate, contactController.markRead);
router.delete("/:id",      authenticate, contactController.deleteMessage);

module.exports = router;
