import { useState } from "react";
import "./Bookings.css";

function Bookings({ bookings, setBookings }) {

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [newUser, setNewUser] = useState("");
  const [newDate, setNewDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState("");
  const [editDate, setEditDate] = useState("");

  const updateStatus = (id, newStatus) => {
    const updated = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updated);
  };

  const addBooking = () => {
    if (!newUser || !newDate) return;

    const newBooking = {
      id: Date.now(),
      user: newUser,
      date: newDate,
      status: "Pending"
    };

    setBookings([...bookings, newBooking]);
    setNewUser("");
    setNewDate("");
  };

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditUser(booking.user);
    setEditDate(booking.date);
  };

  const saveEdit = (id) => {
    if (!editUser || !editDate) return;

    const updated = bookings.map((b) =>
      b.id === id
        ? { ...b, user: editUser, date: editDate }
        : b
    );

    setBookings(updated);
    setEditingId(null);
  };

  // ✅ CSV EXPORT FUNCTION (Added Without Changing Anything)
  const exportCSV = () => {
    const headers = ["ID", "User", "Date", "Status"];

    const rows = bookings.map(b =>
      [b.id, b.user, b.date, b.status].join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "bookings.csv";
    link.click();
  };

  // 🔥 FILTER + SEARCH + SORT
  const filteredBookings = bookings
    .filter((b) =>
      filter === "All" ? true : b.status === filter
    )
    .filter((b) =>
      b.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  return (
    <div className="bookings-page">
      <h1>Booking Management</h1>

      <div className="add-form">
        <input
          type="text"
          placeholder="User Name"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />

        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />

        <button onClick={addBooking}>
          Add Booking
        </button>
      </div>

      <div className="filters">
        {["All", "Pending", "Approved", "Cancelled"].map((type) => (
          <button
            key={type}
            className={filter === type ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search by user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button
          className="sort-btn"
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
        >
          Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>

        {/* ✅ EXPORT BUTTON ADDED */}
        <button className="export-btn" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>

              <td>
                {editingId === booking.id ? (
                  <input
                    type="text"
                    value={editUser}
                    onChange={(e) => setEditUser(e.target.value)}
                  />
                ) : (
                  booking.user
                )}
              </td>

              <td>
                {editingId === booking.id ? (
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                ) : (
                  booking.date
                )}
              </td>

              <td>
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </td>

              <td>
                {editingId === booking.id ? (
                  <button onClick={() => saveEdit(booking.id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => startEdit(booking)}>
                    Edit
                  </button>
                )}

                <button
                  className="approve"
                  onClick={() => updateStatus(booking.id, "Approved")}
                >
                  Approve
                </button>

                <button
                  className="cancel"
                  onClick={() => updateStatus(booking.id, "Cancelled")}
                >
                  Cancel
                </button>

                <button
                  className="delete"
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this booking?"
                    );
                    if (confirmDelete) {
                      setBookings(
                        bookings.filter((b) => b.id !== booking.id)
                      );
                    }
                  }}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bookings;