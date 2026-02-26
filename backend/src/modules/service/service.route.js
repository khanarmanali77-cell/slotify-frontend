const express = require("express");
const router = express.Router();

const serviceController = require("./service.controller");
const auth = require("../../middlewares/auth.middleware");

// protected (token required)
router.post("/", auth, serviceController.createService);

// public
router.get("/", serviceController.getServices);

// ✅ NEW ROUTE (Available Slots)
router.get("/:serviceId/slots", serviceController.getAvailableSlots);

module.exports = router;