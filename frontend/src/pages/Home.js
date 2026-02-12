import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

function Home() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const providersData = await apiService.getAllProviders();
        setProviders(providersData.slice(0, 4));
        
        // Mock services data
        const mockServices = [
          { id: 1, name: "Plumbing", description: "Professional plumbing services" },
          { id: 2, name: "Electrical", description: "Expert electrical work" },
          { id: 3, name: "Mechanic", description: "Auto repair and maintenance" },
          { id: 4, name: "Painting", description: "Interior and exterior painting" },
          { id: 5, name: "HVAC", description: "Heating and cooling systems" },
          { id: 6, name: "General Repair", description: "General home repairs" }
        ];
        setServices(mockServices);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // SEARCH HANDLER
  const handleSearch = async () => {
    if (!serviceQuery && !locationQuery) {
      alert("Please enter a service or location");
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.searchProviders(serviceQuery, locationQuery);
      setProviders(results);
      navigate("/services");
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <h1>
          Local services, <span>instantly</span> found
        </h1>
        <p className="hero-sub">
          Connect with trusted professionals near you — verified and ready.
        </p>

        <div className="hero-search">
          <input
            placeholder="What service do you need?"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <input
            placeholder="Your location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <h4>⚡ Instant Booking</h4>
          <p>Find and book a provider in under 2 minutes</p>
        </div>
        <div className="feature">
          <h4>✓ Verified Pros</h4>
          <p>Every provider is background-checked</p>
        </div>
        <div className="feature">
          <h4>⭐ Top Rated</h4>
          <p>Only the highest-rated professionals</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <span className="view-all-link">View all →</span>
        </div>

        <div className="category-grid">
          {services.map(s => (
            <div className="category-card" key={s.id}>
              <h4>{s.name}</h4>
              <p>{s.description || "Professional services"}</p>
              <button 
                className="btn small"
                onClick={() => {
                  setServiceQuery(s.name);
                  navigate("/services");
                }}
              >
                View Services
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="section">
        <h2>Top Available Providers</h2>
        <p className="section-sub">
          Highly rated pros ready to help right now
        </p>

        <div className="provider-grid">
          {providers.length > 0 ? (
            providers.map(p => (
              <div className="provider-card" key={p.id}>
                <div className="provider-header">
                  <div className="avatar">
                    {p.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h4>{p.name}</h4>
                    <span className="status">Available</span>
                  </div>
                </div>

                <p className="meta">
                  ⭐ {p.rating || "4.8"} · {p.distance || "Nearby"} · {p.time || "15 min"}
                </p>

                <div className="provider-footer">
                  <strong>₹{p.price || "50"}/hr</strong>
                  <button 
                    className="btn"
                    onClick={() => navigate("/services")}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading providers...</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Are you a service professional?</h2>
        <p>
          Join FixNear and connect with customers in your area.
        </p>
        <button 
          className="btn large"
          onClick={() => navigate("/become-provider")}
        >
          Become a Provider →
        </button>
      </section>
    </>
  );
}

export default Home;
