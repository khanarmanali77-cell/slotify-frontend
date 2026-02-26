const Booking = require("../../models/booking.model");
const razorpay = require("../../config/razorpay");
const Service = require("../../models/service.model");
const transporter = require("../../config/mailer");
// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  try {
    // Accept both naming styles
    const serviceId = req.body.serviceId || req.body.service;
    const date = req.body.date;
    const timeSlot = req.body.timeSlot || req.body.time;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const existingBooking = await Booking.findOne({
      service: serviceId,
      date,
      timeSlot,
      status: "approved"
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const service = await Service.findById(serviceId);

if (!service) {
  return res.status(404).json({
    success: false,
    message: "Service not found"
  });
}

const booking = await Booking.create({
  user: req.user.id,
  service: serviceId,
  date,
  timeSlot,
  amount: service.price,
  paymentStatus: "pending"
});

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= GET MY BOOKINGS =================
exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).populate("service");

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (err) {
    console.error("MY BOOKINGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN: GET ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "user",
        select: "-password"
      })
      .populate("service");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (err) {
    console.error("ADMIN GET BOOKINGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN: UPDATE BOOKING STATUS =================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });

  } catch (err) {
    console.error("ADMIN UPDATE STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN: REVENUE CALCULATION =================
exports.getRevenue = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { status: "approved" } },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData"
        }
      },
      { $unwind: "$serviceData" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$serviceData.price" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: revenue[0]?.totalRevenue || 0
    });

  } catch (err) {
    console.error("REVENUE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN: DASHBOARD STATS =================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const approved = await Booking.countDocuments({ status: "approved" });
    const pending = await Booking.countDocuments({ status: "pending" });
    const rejected = await Booking.countDocuments({ status: "rejected" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        approved,
        pending,
        rejected,
        cancelled
      }
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
console.log("EMAIL USER:", process.env.EMAIL_USER);
// ================= CREATE PAYMENT ORDER =================
// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const crypto = require("crypto");

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.paymentId = razorpay_payment_id;
    booking.orderId = razorpay_order_id;
    booking.paymentStatus = "paid";
    booking.status = "approved";

    await booking.save();

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: "Booking Confirmed ✅",
      html: `
        <h2>Your Booking is Confirmed 🎉</h2>
        <p>Date: ${booking.date}</p>
        <p>Time: ${booking.timeSlot}</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & booking approved"
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// ================= CREATE PAYMENT ORDER =================

// ================= CREATE PAYMENT ORDER =================
// ================= CREATE PAYMENT ORDER =================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const options = {
      amount: amount * 100, // Razorpay paise me leta hai
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
};
exports.refundPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking || !booking.paymentId) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    const refund = await razorpay.payments.refund(
      booking.paymentId,
      {
        amount: booking.amount * 100
      }
    );

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Refund successful",
      refund
    });

  } catch (error) {
    console.error("REFUND ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Refund failed"
    });
  }
};