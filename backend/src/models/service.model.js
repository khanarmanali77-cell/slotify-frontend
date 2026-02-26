const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: ["doctor", "salon", "turf", "room", "generic"],
    required: true
  },
  price: Number,
  duration: Number,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
