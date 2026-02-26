import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import "./AdminDashboard.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function AdminDashboard({ bookings }) {

  const total = bookings.length;
  const approved = bookings.filter(b => b.status === "Approved").length;
  const pending = bookings.filter(b => b.status === "Pending").length;
  const cancelled = bookings.filter(b => b.status === "Cancelled").length;

  const revenue = bookings
    .filter(b => b.status === "Approved")
    .reduce((total) => total + 1500, 0);

  // 🔥 Monthly Revenue Chart Logic
  const monthlyData = {};

  bookings
    .filter(b => b.status === "Approved")
    .forEach(b => {
      const month = new Date(b.date).toLocaleString("default", { month: "short" });
      monthlyData[month] = (monthlyData[month] || 0) + 1500;
    });

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Revenue",
        data: Object.values(monthlyData),
        backgroundColor: "#8b5cf6",
      },
    ],
  };

  return (
    <>
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <Card title="Total Bookings" value={total} color="#3b82f6" />
        <Card title="Approved" value={approved} color="#22c55e" />
        <Card title="Pending" value={pending} color="#facc15" />
        <Card title="Cancelled" value={cancelled} color="#ef4444" />
        <Card title="Revenue 💰" value={`₹${revenue}`} color="#8b5cf6" />
      </div>

      <div style={{ marginTop: "40px" }}>
        <Bar data={chartData} />
      </div>
    </>
  );
}

export default AdminDashboard;