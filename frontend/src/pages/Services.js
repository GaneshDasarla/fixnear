import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { useAuth } from "../context/AuthContext";

function Services() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingDate: "",
    serviceType: "",
    description: ""
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "All",
    "Plumbing",
    "Electrical",
    "Mechanic",
    "Painting",
    "HVAC",
    "General Repair",
    "Roofing",
    "Security"
  ];

  // FETCH DATA FROM DATABASE
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAllProviders();
        console.log("Providers fetched:", data);
        setProviders(data);
        setError("");
      } catch (err) {
        setError("Unable to load providers. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // HANDLE SEARCH
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      if (searchService || searchLocation) {
        const data = await apiService.searchProviders(searchService, searchLocation);
        setProviders(data);
        setSelectedCategory("All");
      } else {
        const data = await apiService.getAllProviders();
        setProviders(data);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // RESET SEARCH
  const handleResetSearch = async () => {
    setSearchService("");
    setSearchLocation("");
    setSelectedCategory("All");
    try {
      setLoading(true);
      const data = await apiService.getAllProviders();
      setProviders(data);
      setError("");
    } catch (err) {
      setError("Unable to load providers. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // FILTER BY CATEGORY
  const filteredProviders =
    selectedCategory === "All"
      ? providers
      : providers.filter((p) => {
          const service = p.service || "";
          return service.toLowerCase() === selectedCategory.toLowerCase();
        });

  console.log("Selected Category:", selectedCategory);
  console.log("Filtered Providers Count:", filteredProviders.length);
  console.log("All Providers:", providers);

  // HANDLE BOOKING
  const handleBooking = async () => {
    if (!bookingData.bookingDate || !bookingData.serviceType) {
      setBookingError("Please fill in all required fields");
      return;
    }

    if (!token) {
      setBookingError("Please login to book a service");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const booking = {
        userId: token ? null : null,
        providerId: bookingModal.id || bookingModal._id,
        // bookingDate should be ISO LocalDateTime for backend (add time if only date chosen)
        bookingDate: bookingData.bookingDate ? `${bookingData.bookingDate}T09:00:00` : null,
        serviceType: bookingData.serviceType,
        description: bookingData.description
      };

      // If user object is available, use userId from there
      if (window.localStorage.getItem("user")) {
        const savedUser = JSON.parse(window.localStorage.getItem("user"));
        booking.userId = savedUser.userId;
      }

      await apiService.createBooking(booking);
      // redirect to user cart so bookings refresh
      setBookingModal(null);
      navigate("/cart");
      setBookingData({
        bookingDate: "",
        serviceType: "",
        description: ""
      });
    } catch (err) {
      setBookingError("Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="services-page">
      <h1>Find a Service Provider</h1>
      <p className="subtitle">
        Search by service type, specialty, or location
      </p>

      {/* SEARCH BAR */}
      <form className="service-search" onSubmit={handleSearch}>
        <input 
          placeholder="What service do you need?" 
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
        />
        <input 
          placeholder="Your location" 
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button type="submit" className="btn">Search</button>
        {(searchService || searchLocation) && (
          <button 
            type="button" 
            className="btn outline" 
            onClick={handleResetSearch}
          >
            Reset
          </button>
        )}
      </form>

      {/* CATEGORY FILTERS */}
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* STATUS MESSAGES */}
      {loading && <p>Loading providers...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && filteredProviders.length === 0 && (
        <p>No providers found</p>
      )}

      {/* PROVIDER LIST */}
      <div className="providers">
        {filteredProviders.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-header">
              <div className="avatar">
                {p.name ? p.name.charAt(0).toUpperCase() : "?"}
              </div>

              <div>
                <h3>{p.name}</h3>
                <span
                  className={`status ${
                    p.available ? "available" : "busy"
                  }`}
                >
                  {p.available ? "Available" : "Busy"}
                </span>
              </div>
            </div>

            <div className="meta">
              ⭐ {p.rating || "N/A"} · {p.distance || "Nearby"} · {p.time || "15 min"}
            </div>

            <div className="skills">
              <span className="skill">{p.service}</span>
            </div>

            <div className="card-footer">
              <strong>${p.price || "50"}/hr</strong>

              <div className="actions">
                <button className="btn outline">View Profile</button>
                {p.available && (
                  <button
                    className="btn"
                    onClick={() => {
                      if (!token) {
                        alert("Please login to book a service");
                        return;
                      }
                      setBookingModal(p);
                    }}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {bookingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Book {bookingModal.name}</h3>
              <button
                className="modal-close"
                onClick={() => setBookingModal(null)}
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div className="error-message">{bookingError}</div>
            )}

            <div className="modal-body">
              <input
                type="date"
                value={bookingData.bookingDate}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    bookingDate: e.target.value
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Service Type"
                value={bookingData.serviceType}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    serviceType: e.target.value
                  })
                }
                required
              />

              <textarea
                placeholder="Additional description (optional)"
                value={bookingData.description}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    description: e.target.value
                  })
                }
              ></textarea>
            </div>

            <div className="modal-footer">
              <button
                className="btn outline"
                onClick={() => setBookingModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
