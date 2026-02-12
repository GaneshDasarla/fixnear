import config from "../config";

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE;
  }

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      // Always try to parse JSON response
      if (response.status === 204) return null;
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return null;
      }

      // Return data regardless of status code (let caller handle it)
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  }

  signup(name, email, password) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
  }

  // Provider endpoints
  getAllProviders() {
    return this.request("/providers");
  }

  getProviderByUser(userId) {
    return this.request(`/providers/user/${userId}`);
  }

  getProvidersByService(service) {
    return this.request(`/providers?service=${service}`);
  }

  searchProviders(service, location) {
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    if (location) params.append("location", location);
    return this.request(`/providers?${params.toString()}`);
  }

  addProvider(providerData) {
    return this.request("/providers", {
      method: "POST",
      body: JSON.stringify(providerData)
    });
  }

  // Booking endpoints
  createBooking(bookingData) {
    return this.request("/api/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData)
    });
  }

  getBooking(id) {
    return this.request(`/api/bookings/${id}`);
  }

  getUserBookings(userId) {
    return this.request(`/api/bookings?userId=${userId}`);
  }

  cancelBooking(id) {
    return this.request(`/api/bookings/${id}`, {
      method: "DELETE"
    });
  }

  getProviderBookings(providerId) {
    return this.request(`/api/bookings?providerId=${providerId}`);
  }

  updateBookingStatus(bookingId, status, reason = "") {
    return this.request(`/api/bookings/${bookingId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, reason })
    });
  }

  addBookingReview(bookingId, reviewData) {
    return this.request(`/api/bookings/${bookingId}/review`, {
      method: "PUT",
      body: JSON.stringify(reviewData)
    });
  }

  // Admin endpoints
  getAdminDashboard() {
    return this.request("/api/admin/dashboard");
  }

  getAllUsers() {
    return this.request("/api/admin/users");
  }

  deleteUser(id) {
    return this.request(`/api/admin/users/${id}`, {
      method: "DELETE"
    });
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
