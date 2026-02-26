import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("bookings");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, user: "Arman", date: "2026-02-25", status: "Pending" },
          { id: 2, user: "Rahul", date: "2026-02-24", status: "Approved" },
          { id: 3, user: "Zaid", date: "2026-02-23", status: "Cancelled" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminDashboard bookings={bookings} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <Bookings bookings={bookings} setBookings={setBookings} />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;