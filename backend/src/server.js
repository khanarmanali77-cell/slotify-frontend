// ================= SERVER ENTRY =================
require("dotenv").config();   // 👈 Sabse pehle env load

const app = require("./app");
const connectDB = require("./config/db");

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Slotify server running on port ${PORT}`);
});