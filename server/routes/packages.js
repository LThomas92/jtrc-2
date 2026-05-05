const express           = require("express");
const router            = express.Router();
const packageController = require("../controllers/packagesController");
const { authenticate }  = require("../middleware/auth");

// Public
router.get("/",    packageController.list);
router.get("/:id", packageController.getOne);

// Admin only
router.post("/",      authenticate, packageController.create);
router.patch("/:id",  authenticate, packageController.update);
router.delete("/:id", authenticate, packageController.remove);

module.exports = router;
