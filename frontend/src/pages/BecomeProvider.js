import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import "../styles/provider.css";

function BecomeProvider() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    service: "Plumbing",
    location: "",
    price: "",
    workingHours: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const services = [
    "Plumbing",
    "Electrical",
    "Mechanic",
    "Painting",
    "HVAC",
    "General Repair",
    "Roofing",
    "Security"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create user account (use auth context signup so token + user persisted)
      const res = await signup(formData.name, formData.email, formData.password);
      if (!res || !res.success) {
        throw new Error(res.error || "Account creation failed");
      }

      const createdUser = res.user || JSON.parse(window.localStorage.getItem("user"));

      // Then add provider profile and link to userId
      const providerData = {
        name: formData.name,
        service: formData.service,
        location: formData.location,
        price: parseFloat(formData.price),
        workingHours: formData.workingHours,
        available: true,
        rating: 0,
        userId: createdUser.userId
      };

      await apiService.addProvider(providerData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/provider-dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to register as provider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="provider-page">
      <div className="provider-hero">
        <h1>Earn Money as a Service Professional</h1>
        <p>Join thousands of professionals earning on FixNear</p>
      </div>

      <div className="provider-container">
        <div className="provider-benefits">
          <h2>Why Join FixNear?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Set Your Own Rates</h3>
              <p>Control your pricing and earn what you're worth</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📍</div>
              <h3>Work Locally</h3>
              <p>Connect with customers in your area</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⭐</div>
              <h3>Build Your Reputation</h3>
              <p>Earn ratings and reviews from satisfied customers</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💼</div>
              <h3>Flexible Schedule</h3>
              <p>Work at your own pace and choose your hours</p>
            </div>
          </div>
        </div>

        <div className="provider-form-container">
          <h2>Create Your Provider Account</h2>
          
          {success && (
            <div className="success-message">
              ✅ Registration successful! Redirecting to login...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="provider-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City / Area"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hourly Rate ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  placeholder="e.g., 9AM-6PM"
                />
              </div>
            </div>

            <div className="form-group">
              <label>About You (Bio)</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell customers about your experience and expertise..."
                rows="4"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Become a Provider"}
            </button>

            <p className="login-link">
              Already a provider? <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BecomeProvider;
