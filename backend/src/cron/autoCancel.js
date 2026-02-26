// ================= AUTO CANCEL CRON =================
const cron = require("node-cron");
const Booking = require("../models/booking.model");

cron.schedule("* * * * *", async () => {
  try {
    console.log("⏳ Auto cancel checking...");

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const result = await Booking.updateMany(
      {
        status: "pending",
        paymentStatus: "pending",
        createdAt: { $lte: fifteenMinutesAgo }
      },
      {
        status: "cancelled"
      }
    );

    if (result.modifiedCount > 0) {
      console.log("❌ Cancelled:", result.modifiedCount);
    }

  } catch (error) {
    console.error("AUTO CANCEL ERROR:", error);
  }
});