const express = require("express");
const controller = require("../controllers/omborController");

const router = express.Router();

router.get("/", controller.getOmborItems);
router.get("/:id", controller.getOmborItemById);
router.post("/", controller.createOmborItem);
router.put("/:id", controller.updateOmborItem);
router.delete("/:id", controller.deleteOmborItem);

module.exports = router;
