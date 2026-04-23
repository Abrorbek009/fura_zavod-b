const express = require("express");
const controller = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", controller.getVehicles);
router.get("/:id", controller.getVehicleById);
router.post("/", controller.createVehicle);
router.put("/:id", controller.updateVehicle);
router.delete("/:id", controller.deleteVehicle);

module.exports = router;
