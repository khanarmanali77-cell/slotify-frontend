import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation(); // current page check karne ke liye

  return (
    <div className={open ? "sidebar open" : "sidebar"}>
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <h2 className="logo">{open ? "Slotify 🚀" : "🚀"}</h2>

      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Dashboard
          </Link>
        </li>

        <li className={location.pathname === "/bookings" ? "active" : ""}>
          <Link to="/bookings" style={{ textDecoration: "none", color: "white" }}>
            Bookings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;