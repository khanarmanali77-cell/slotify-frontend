const Service = require("../../models/service.model");
const Booking = require("../../models/booking.model"); // ✅ NEW ADD

// ================= CREATE SERVICE =================
// (Admin / Protected)
exports.createService = async (req, res) => {
  try {
    const { name, serviceType, price, duration } = req.body;

    if (!name || !serviceType) {
      return res.status(400).json({
        success: false,
        message: "Name and serviceType required"
      });
    }

    const service = await Service.create({
      name,
      serviceType,
      price,
      duration
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service
    });

  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= GET ALL SERVICES =================
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    return res.json({
      success: true,
      services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= GET AVAILABLE SLOTS =================
exports.getAvailableSlots = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    // 🔹 Static slots (baad me dynamic bana sakte hain)
    const allSlots = [
      "09:00 - 09:30",
      "10:00 - 10:30",
      "11:00 - 11:30",
      "12:00 - 12:30",
      "13:00 - 13:30",
      "14:00 - 14:30"
    ];

    const bookedSlots = await Booking.find({
      service: serviceId,
      date,
      status: { $ne: "cancelled" }
    }).select("timeSlot");

    const booked = bookedSlots.map(b => b.timeSlot);

    const availableSlots = allSlots.filter(
      slot => !booked.includes(slot)
    );

    return res.status(200).json({
      success: true,
      availableSlots
    });

  } catch (error) {
    console.error("AVAILABLE SLOTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};