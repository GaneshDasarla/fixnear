# 🎯 Quick Reference - Frontend Functions

## 🔐 Authentication (useAuth Hook)

```javascript
import { useAuth } from "../context/AuthContext";

const { user, token, loading, error, login, signup, logout } = useAuth();
```

### Login
```javascript
const result = await login(email, password);
// Returns: { success: true } or { success: false, error: message }
```

### Signup
```javascript
const result = await signup(name, email, password);
// Returns: { success: true } or { success: false, error: message }
```

### Logout
```javascript
logout();
// Clears token and user state
```

### Check Authentication
```javascript
if (token) {
  // User is logged in
}
```

---

## 🌐 API Service (apiService)

```javascript
import apiService from "../services/apiService";
```

### Provider Endpoints

```javascript
// Get all providers
const providers = await apiService.getAllProviders();

// Get providers by service
const providers = await apiService.getProvidersByService("Plumbing");

// Search providers
const providers = await apiService.searchProviders(service, location);

// Add new provider
const newProvider = await apiService.addProvider({
  name: "John",
  service: "Plumbing",
  available: true
});
```

### Booking Endpoints

```javascript
// Create booking
const booking = await apiService.createBooking({
  providerId: "id",
  bookingDate: "2024-02-15T10:00:00",
  serviceType: "Plumbing",
  description: "Fix leak"
});

// Get specific booking
const booking = await apiService.getBooking(bookingId);

// Get user bookings
const bookings = await apiService.getUserBookings(userId);

// Cancel booking
await apiService.cancelBooking(bookingId);
```

### Admin Endpoints

```javascript
// Get dashboard
const dashboard = await apiService.getAdminDashboard();

// Get all users
const users = await apiService.getAllUsers();

// Delete user
await apiService.deleteUser(userId);
```

---

## 📝 Common Usage Examples

### Login & Navigate
```javascript
const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async (email, password) => {
  const result = await login(email, password);
  if (result.success) {
    navigate("/services");
  }
};
```

### Fetch & Display Data
```javascript
useEffect(() => {
  const fetchProviders = async () => {
    try {
      const data = await apiService.getAllProviders();
      setProviders(data);
    } catch (err) {
      setError("Failed to load providers");
    }
  };
  fetchProviders();
}, []);
```

### Create Booking with Modal
```javascript
const [bookingModal, setBookingModal] = useState(null);

const handleBooking = async () => {
  try {
    await apiService.createBooking({
      providerId: bookingModal.id,
      bookingDate: bookingData.date,
      serviceType: bookingData.service,
      description: bookingData.description
    });
    alert("Booking successful!");
    setBookingModal(null);
  } catch (err) {
    setError("Booking failed");
  }
};
```

### Protected Component
```javascript
import { ProtectedRoute } from "../routes/ProtectedRoute";

<Route 
  path="/bookings" 
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 UI Components

### Auth Error Message
```javascript
{error && <div className="error-message">{error}</div>}
```

### Loading State
```javascript
<button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</button>
```

### Modal Booking
```javascript
{bookingModal && (
  <div className="modal-overlay">
    <div className="modal">
      {/* Modal content */}
    </div>
  </div>
)}
```

### User Menu (Navbar)
```javascript
{token && user ? (
  <div className="user-menu">
    <span className="user-greeting">Welcome, {user.email}!</span>
    <button className="logout-btn" onClick={logout}>Logout</button>
  </div>
) : (
  {/* Login/Signup buttons */}
)}
```

---

## 🔄 Data Flow Example: Complete Booking

```javascript
// 1. User clicks "Book Now"
const handleBookClick = () => {
  if (!token) {
    alert("Please login");
    return;
  }
  setBookingModal(provider);
};

// 2. User fills form and clicks "Confirm"
const handleConfirmBooking = async () => {
  setBookingLoading(true);
  try {
    // 3. Send to API
    await apiService.createBooking({
      providerId: bookingModal.id,
      bookingDate: bookingData.date,
      serviceType: bookingData.service,
      description: bookingData.description
    });
    
    // 4. Success response
    alert("Booking created!");
    setBookingModal(null);
    
  } catch (err) {
    // 5. Error handling
    setError("Failed to create booking");
  } finally {
    setBookingLoading(false);
  }
};
```

---

## ✅ Validation Examples

### Email Validation
```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### Form Validation (Signup)
```javascript
if (!name || !email || !password) {
  setError("All fields required");
  return;
}

if (password.length < 6) {
  setError("Password must be 6+ characters");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords don't match");
  return;
}
```

---

## 🚀 Performance Tips

1. **Memoize Components**
   ```javascript
   const ProviderCard = React.memo(({ provider }) => (...));
   ```

2. **Lazy Load Pages**
   ```javascript
   const Services = lazy(() => import("./pages/Services"));
   ```

3. **Debounce Search**
   ```javascript
   const handleSearch = debounce(() => {
     apiService.searchProviders(query);
   }, 500);
   ```

---

## 🐛 Error Handling

### API Error
```javascript
try {
  await apiService.getProviders();
} catch (err) {
  console.error(err);
  setError("Network error. Please try again.");
}
```

### Auth Error
```javascript
const result = await login(email, password);
if (!result.success) {
  setError(result.error);
}
```

### Validation Error
```javascript
if (!email || !validateEmail(email)) {
  setError("Invalid email format");
  return;
}
```

---

## 📚 Files to Edit for Customization

| File | Purpose |
|------|---------|
| `context/AuthContext.js` | Change auth logic |
| `services/apiService.js` | Add/modify API calls |
| `styles/main.css` | Change colors/styling |
| `pages/Services.js` | Customize booking UI |
| `components/Navbar.js` | Change navigation |

---

## 💯 Complete Working Example

```javascript
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

function Dashboard() {
  const { user, token, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    
    const loadBookings = async () => {
      setLoading(true);
      try {
        const data = await apiService.getUserBookings(user.id);
        setBookings(data);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [token]);

  return (
    <div>
      <h1>My Bookings - {user?.email}</h1>
      {error && <div className="error-message">{error}</div>}
      {loading ? <p>Loading...</p> : (
        <div>
          {bookings.map(b => (
            <div key={b.id}>
              <h3>{b.serviceType}</h3>
              <p>Date: {b.bookingDate}</p>
              <button onClick={() => apiService.cancelBooking(b.id)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
```

---

**Everything is ready to use! Start by running `npm start` in the frontend folder.**
