import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";
import "../styles/provider-dashboard.css";

function ProviderDashboard() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerMissing, setProviderMissing] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending, accepted, rejected, completed

  useEffect(() => {
    fetchProviderBookings();
  }, [user, token]);
  const fetchProviderBookings = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // First find provider profile linked to this user
      const provider = await apiService.getProviderByUser(user.userId);
      if (!provider || !provider.id) {
        setBookings([]);
        setProviderMissing(true);
        setError("No provider profile linked to this account");
        setLoading(false);
        return;
      }

      const response = await apiService.getProviderBookings(provider.id);
      const normalized = (response || []).map((b) => ({
        ...b,
        status: b.status ? b.status.toLowerCase() : "pending",
      }));
      setBookings(normalized);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const res = await apiService.updateBookingStatus(bookingId, "ACCEPTED");
      const newStatus = res?.status ? res.status.toLowerCase() : "accepted";
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      alert("Booking accepted! Customer will be notified.");
    } catch (err) {
      alert("Failed to accept booking");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt("Enter reason for rejection (optional):", "");
    if (reason === null) return; // User cancelled

    try {
      const res = await apiService.updateBookingStatus(bookingId, "REJECTED", reason);
      const newStatus = res?.status ? res.status.toLowerCase() : "rejected";
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      alert("Booking rejected. Customer will be notified.");
    } catch (err) {
      alert("Failed to reject booking");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const res = await apiService.updateBookingStatus(bookingId, "COMPLETED");
      const newStatus = res?.status ? res.status.toLowerCase() : "completed";
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      alert("Booking marked as completed!");
    } catch (err) {
      alert("Failed to complete booking");
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter((b) => b.status === filter || filter === "all");
  };

  const filteredBookings = getFilteredBookings();

  if (!token || !user) {
    return (
      <div className="provider-dashboard-container">
        <div className="empty-state">
          <h2>👷 Provider Dashboard</h2>
          <p>Please log in to manage your bookings</p>
          <a href="/login" className="btn btn-primary">
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (providerMissing) {
    return (
      <div className="provider-dashboard-page">
        <section className="hero">
          <h1>Provider Dashboard</h1>
          <p className="hero-sub">You don't have a provider profile yet</p>
        </section>
        <div className="provider-dashboard-container">
          <div className="empty-state">
            <h3>🔔 No provider profile linked</h3>
            <p>
              To receive booking requests you need to create a provider profile. Click below to create your profile and link it to this account.
            </p>
            <a href="/become-provider" className="btn btn-primary">
              Create Provider Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-dashboard-page">
      <section className="hero">
        <h1>Provider Dashboard</h1>
        <p className="hero-sub">Respond to booking requests and manage your work</p>
      </section>
      <div className="dashboard-header">
        <h1>👷 Provider Dashboard</h1>
        <p>Manage your booking requests</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="provider-dashboard-container">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "accepted").length}
            </div>
            <div className="stat-label">Accepted</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "rejected").length}
            </div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            🔔 Pending ({bookings.filter((b) => b.status === "pending").length})
          </button>
          <button
            className={`tab ${filter === "accepted" ? "active" : ""}`}
            onClick={() => setFilter("accepted")}
          >
            ✅ Accepted ({bookings.filter((b) => b.status === "accepted").length})
          </button>
          <button
            className={`tab ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            ⭐ Completed ({bookings.filter((b) => b.status === "completed").length})
          </button>
          <button
            className={`tab ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            ❌ Rejected ({bookings.filter((b) => b.status === "rejected").length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`booking-request-card status-${booking.status}`}
              >
                <div className="request-header">
                  <div className="customer-info">
                    <div className="avatar">
                      {booking.userName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3>{booking.userName || "Customer"}</h3>
                      <p className="service-badge">{booking.service}</p>
                    </div>
                  </div>
                  <div className={`status-badge ${booking.status}`}>
                    {booking.status.toUpperCase()}
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span className="label">📍 Location:</span>
                    <span className="value">{booking.location || "Not specified"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">📅 Date:</span>
                    <span className="value">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">💰 Price:</span>
                    <span className="value">₹{booking.price || "N/A"}</span>
                  </div>
                  {booking.description && (
                    <div className="detail-row">
                      <span className="label">📝 Description:</span>
                      <span className="value description">{booking.description}</span>
                    </div>
                  )}
                </div>

                {/* Status Specific Actions */}
                <div className="request-actions">
                  {booking.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        className="btn btn-accept"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "accepted" && (
                    <div className="action-buttons">
                      <p className="info-text">
                        ✅ You accepted this booking. Mark as complete when done.
                      </p>
                      <button
                        className="btn btn-complete"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        🏁 Mark Complete
                      </button>
                    </div>
                  )}

                  {booking.status === "completed" && (
                    <div className="review-section">
                      {booking.rating ? (
                        <>
                          <p className="rating-display">
                            ⭐ Customer rated: {booking.rating}/5
                          </p>
                          {booking.review && (
                            <p className="review-text">"{booking.review}"</p>
                          )}
                        </>
                      ) : (
                        <p className="info-text">
                          ✅ Awaiting customer review
                        </p>
                      )}
                    </div>
                  )}

                  {booking.status === "rejected" && (
                    <p className="info-text rejection-text">
                      You rejected this booking request
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>
                {filter === "pending"
                  ? "📭 No pending requests"
                  : `No ${filter} bookings`}
              </h3>
              <p>
                {filter === "pending"
                  ? "Great job! Check back later for new requests"
                  : "You have no bookings in this category"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
