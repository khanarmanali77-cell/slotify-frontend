const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const admin = require("../../middlewares/admin.middleware");

const {
  createBooking,
  createPaymentOrder,
  myBookings,
  cancelBooking,
  refundPayment,
  verifyPayment,
  getAllBookings,
  updateBookingStatus,
  getRevenue,
  getDashboardStats
} = require("./booking.controller");

// USER ROUTES
router.post("/", auth, createBooking);
router.get("/me", auth, myBookings);
router.patch("/:id/cancel", auth, cancelBooking);
router.post("/create-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);

// ADMIN ROUTES
router.get("/admin/all", auth, admin, getAllBookings);
router.patch("/admin/:id/status", auth, admin, updateBookingStatus);
router.get("/admin/revenue", auth, admin, getRevenue);
router.get("/admin/dashboard", auth, admin, getDashboardStats);
router.post("/admin/:id/refund", auth, admin, refundPayment);
module.exports = router;