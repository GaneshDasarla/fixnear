# FixNear Frontend - Complete Setup Guide

## 🎯 What's Been Implemented

Your frontend is now **fully connected to the backend** with production-ready features:

### ✅ Authentication System
- **Login/Signup Forms** with validation
- **JWT Token Management** - automatic token storage
- **Protected Components** - routes require authentication
- **User Session** - persistent across page refreshes
- **Logout Functionality** - clear token and redirect

### ✅ Real-time API Integration
- **Provider Listings** - fetch from MongoDB
- **Service Search** - filter by category
- **Booking System** - create and manage bookings
- **Error Handling** - graceful error messages and loading states

### ✅ User Experience
- **Responsive Design** - works on all devices
- **Loading States** - visual feedback during API calls
- **Error Messages** - clear feedback on failures
- **User Menu** - shows logged-in status
- **Modal Booking** - book services without page refresh

## 🚀 How to Run

### Prerequisites
```bash
# Make sure you have Node.js installed
node --version
npm --version
```

### Installation
```bash
cd frontend
npm install
```

### Start Development Server
```bash
npm start
```
Opens http://localhost:3000

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js          # Authentication state management
│   ├── routes/
│   │   └── ProtectedRoute.js       # Protected route wrapper
│   ├── services/
│   │   └── apiService.js           # API calls to backend
│   ├── pages/
│   │   ├── Home.js                 # Landing page with search
│   │   ├── Services.js             # Browse & book services (WITH BOOKING MODAL)
│   │   ├── Login.js                # Login form (WITH VALIDATION)
│   │   ├── Signup.js               # Signup form (WITH VALIDATION)
│   │   └── HowItWorks.js           # How it works page
│   ├── components/
│   │   ├── Navbar.js               # Navigation (WITH USER MENU)
│   │   ├── Footer.js               # Footer with theme toggle
│   │   ├── MapView.js              # Google Maps embed
│   │   └── ProviderCard.js         # Provider card display
│   ├── styles/
│   │   └── main.css                # All styling (WITH MODAL & AUTH STYLES)
│   ├── App.js                      # Main app with routing (WITH AUTH PROVIDER)
│   └── index.js                    # React entry point
└── .env                            # Environment variables
```

## 🔐 Authentication Flow

### 1. **Signup**
```
User enters name, email, password
↓
Frontend validates (password match, length, email format)
↓
POST /api/auth/signup with credentials
↓
Backend validates & hashes password
↓
Returns JWT token
↓
Token stored in localStorage
↓
Redirect to /services
```

### 2. **Login**
```
User enters email, password
↓
Frontend validates
↓
POST /api/auth/login with credentials
↓
Backend verifies password
↓
Returns JWT token
↓
Token stored in localStorage
↓
User state updated in AuthContext
↓
Redirect to /services
```

### 3. **Protected Routes**
```
User accesses page requiring auth
↓
ProtectedRoute checks for token
↓
If no token → Redirect to /login
↓
If token exists → Show page
↓
API calls automatically include Authorization header
```

## 📱 Feature Guide

### Home Page (`/`)
- **Search Bar** - Find services by name and location
- **Categories** - Browse by service type
- **Top Providers** - View available providers
- **CTA Button** - Become a provider

### Services Page (`/services`)
- **Provider Grid** - All available services
- **Category Filter** - Filter by service type
- **Booking Modal** - Click "Book Now" to:
  - Select booking date
  - Specify service type
  - Add description
  - Confirm booking

### Login Page (`/login`)
- Email & password fields
- Validation
- Auto-redirect to services on success
- Link to signup

### Signup Page (`/signup`)
- Name, email, password fields
- Confirm password field
- Password validation (min 6 chars)
- Match validation
- Auto-login & redirect on success

## 🔗 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| GET | `/providers` | Get all providers |
| GET | `/providers?service={name}` | Filter providers by service |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/{id}` | Get booking details |
| DELETE | `/api/bookings/{id}` | Cancel booking |

## 🛠️ Key Technologies

- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Context API** - State management for auth
- **Fetch API** - HTTP requests
- **LocalStorage** - Token persistence

## 📝 Environment Variables

```env
REACT_APP_API_BASE=http://localhost:8081
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key
```

## 🐛 Common Issues & Solutions

### 1. **CORS Error**
**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"
**Solution:** Backend already has CORS configured. Ensure backend is running on port 8081

### 2. **Token Not Persisting**
**Problem:** User logs out after page refresh
**Solution:** Check browser's localStorage - token should be saved
- DevTools → Application → LocalStorage → token

### 3. **API 401 Unauthorized**
**Problem:** API returns 401 error
**Solution:** Token may have expired. Login again
- Check AuthContext in DevTools

### 4. **Booking Not Working**
**Problem:** "Please login to book a service"
**Solution:** 
- Must be logged in
- Click "Book Now" button
- Modal should appear

## ✨ Testing Workflow

### 1. **Test Full Flow**
```
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create account with test email
4. Auto-redirects to services
5. Browse providers
6. Click "Book Now" on a provider
7. Fill booking details
8. Click "Confirm Booking"
9. Check backend for booking in DB
```

### 2. **Test Login**
```
1. Click logout button
2. Navbar shows "Log In / Sign Up"
3. Click "Log In"
4. Enter credentials from signup
5. Auto-redirects to services
```

### 3. **Test Search**
```
1. On home page, enter service name
2. Click "Search"
3. Redirects to services filtered by that service
```

## 📦 Available Scripts

```bash
npm start        # Run development server
npm run build    # Create production build
npm test         # Run tests
npm run eject    # Eject from Create React App
```

## 🚨 Make Sure Backend is Running

**Before testing, start the backend:**
```bash
cd backend
mvn spring-boot:run
```

The backend must be running on `http://localhost:8081` for frontend to work.

## 💡 Next Steps

1. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

3. **Test the App**
   - Sign up with test email
   - Navigate through pages
   - Book a service
   - Check MongoDB for data

4. **Deploy**
   ```bash
   npm run build
   # Deploy build/ folder to Netlify, Vercel, etc.
   ```

## 📞 Support

For any issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify .env configuration
4. Ensure both frontend and backend are running

---

**Your app is now production-ready! 🎉**
