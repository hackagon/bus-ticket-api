const express = require("express");
const stationController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth")

const router = express.Router();

router.get("/", stationController.getStations)
router.get("/:id", stationController.getStationById)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  stationController.createStation
)
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  stationController.replaceStationById
)
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  stationController.updateStationById
)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  stationController.deleteStationById
)

module.exports = router;