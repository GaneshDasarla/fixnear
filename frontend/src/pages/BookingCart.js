import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";
import "../styles/cart.css";

function BookingCart() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, accepted, rejected, completed

  useEffect(() => {
    fetchBookings();
  }, [user, token]);

  const fetchBookings = async () => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getUserBookings(user.userId);
      const normalized = (response || []).map((b) => ({
        ...b,
        status: b.status ? b.status.toLowerCase() : "pending",
      }));
      setBookings(normalized);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await apiService.cancelBooking(bookingId);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert("Booking cancelled successfully");
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const handleAddReview = async (bookingId) => {
    const rating = prompt("Rate this service (1-5):", "5");
    if (!rating) return;

    const review = prompt("Add a review (optional):", "");

    try {
      const res = await apiService.addBookingReview(bookingId, {
        rating: parseInt(rating),
        review: review || ""
      });
      const newStatus = res?.status ? res.status.toLowerCase() : "completed";
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, rating: parseInt(rating), review: review || "", status: newStatus } : b
        )
      );
      alert("Review added successfully!");
    } catch (err) {
      alert("Failed to add review");
    }
  };

  const getFilteredBookings = () => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  };

  const filteredBookings = getFilteredBookings();

  if (!token || !user) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>📋 My Bookings</h2>
          <p>Please log in to view your bookings</p>
          <a href="/login" className="btn btn-primary">
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="hero">
        <h1>My Bookings</h1>
        <p className="hero-sub">Manage and track your service requests</p>
      </section>
      <div className="cart-header">
        <h1>📋 My Bookings</h1>
        <p>Track your service bookings here</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-container">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({bookings.length})
          </button>
          <button
            className={`tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({bookings.filter((b) => b.status === "pending").length})
          </button>
          <button
            className={`tab ${filter === "accepted" ? "active" : ""}`}
            onClick={() => setFilter("accepted")}
          >
            Accepted ({bookings.filter((b) => b.status === "accepted").length})
          </button>
          <button
            className={`tab ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({bookings.filter((b) => b.status === "rejected").length})
          </button>
          <button
            className={`tab ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({bookings.filter((b) => b.status === "completed").length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {loading ? (
            <div className="loading">Loading your bookings...</div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className={`booking-card status-${booking.status}`}>
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.providerName || "Service Provider"}</h3>
                    <p className="service-type">
                      📍 {booking.service} • {booking.location || "Location"}
                    </p>
                  </div>
                  <div className={`status-badge ${booking.status}`}>
                    {booking.status.toUpperCase()}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Service:</span>
                    <span className="value">{booking.service}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Price:</span>
                    <span className="value">₹{booking.price || "N/A"}</span>
                  </div>
                  {booking.description && (
                    <div className="detail-row">
                      <span className="label">Description:</span>
                      <span className="value">{booking.description}</span>
                    </div>
                  )}
                </div>

                {/* Status Specific Actions */}
                <div className="booking-actions">
                  {booking.status === "pending" && (
                    <>
                      <p className="info-text">⏳ Waiting for provider to respond...</p>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}

                  {booking.status === "rejected" && (
                    <p className="info-text rejection-text">
                      ❌ Provider rejected your booking request
                    </p>
                  )}

                  {booking.status === "accepted" && (
                    <p className="info-text accepted-text">
                      ✅ Provider accepted your booking — status: Pending (awaiting service).
                    </p>
                  )}

                  {booking.status === "completed" && !booking.rating && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleAddReview(booking.id)}
                    >
                      Add Review & Rating
                    </button>
                  )}

                  {booking.rating && (
                    <div className="review-section">
                      <p className="rating-display">
                        ⭐ You rated: {booking.rating}/5
                      </p>
                      {booking.review && <p className="review-text">{booking.review}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <h3>📦 No bookings yet</h3>
              <p>Start by exploring our services and booking a professional</p>
              <a href="/services" className="btn btn-primary">
                Browse Services
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCart;
