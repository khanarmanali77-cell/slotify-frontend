// ================= APP SETUP =================
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 CRON LOAD (Auto Cancel)
require("./cron/autoCancel");

// Routes
const healthRoutes = require("./routes/health.route");
const authRoutes = require("./modules/auth/auth.route");
const serviceRoutes = require("./modules/service/service.route");
const bookingRoutes = require("./modules/booking/booking.route");
const protectedRoutes = require("./routes/protected.route");

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/protected", protectedRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Slotify backend is running 🚀"
  });
});

module.exports = app;