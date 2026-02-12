# ✅ Frontend Testing Checklist

## 🚀 Pre-Testing Setup

- [ ] Backend running on `http://localhost:8081`
- [ ] Frontend running on `http://localhost:3000`
- [ ] MongoDB running locally or accessible
- [ ] `.env` file configured correctly
- [ ] Browser DevTools open (F12) to check console

## 🏠 Home Page Tests (`/`)

- [ ] Page loads without errors
- [ ] Hero section displays properly
- [ ] Hero search bar is visible and functional
- [ ] Can type in "What service do you need?" input
- [ ] Can type in "Your location" input
- [ ] Search button is clickable
- [ ] Features section displays 3 cards
- [ ] Browse by Category section shows services
- [ ] Category cards are clickable
- [ ] Top Providers section loads provider data
- [ ] Provider cards display: avatar, name, rating, price
- [ ] "Book Now" button is visible on provider cards
- [ ] "Become a Provider →" CTA button works
- [ ] Dark mode toggle works (sun/moon button)
- [ ] Footer is visible at bottom

## 🔐 Authentication Tests

### Signup Flow
- [ ] Click "Sign Up" in navbar
- [ ] Navigates to `/signup`
- [ ] Form displays with all fields: Name, Email, Password, Confirm Password
- [ ] Try submitting empty form → shows error
- [ ] Try passwords that don't match → shows error
- [ ] Try short password (< 6 chars) → shows error
- [ ] Fill form correctly
- [ ] Click "Create Account"
- [ ] See loading state
- [ ] On success → Auto-login & redirect to `/services`
- [ ] User email shows in navbar ("Welcome, user@email.com!")
- [ ] Token saved in localStorage
  - Open DevTools → Application → LocalStorage → token should exist

### Login Flow
- [ ] Navigate to `/login`
- [ ] Form displays with Email and Password fields
- [ ] Try submitting empty form → shows error
- [ ] Enter invalid credentials → shows error
- [ ] Enter valid credentials (from signup)
- [ ] Click "Login"
- [ ] See loading state
- [ ] On success → redirect to `/services`
- [ ] User email shows in navbar
- [ ] Can access protected pages

### Logout Flow
- [ ] Click logout button in navbar (red button)
- [ ] Navbar shows "Log In" / "Sign Up" again
- [ ] Redirects to home page
- [ ] Token removed from localStorage
- [ ] Trying to access `/services` → redirects to `/login`

## 🛠️ Services Page Tests (`/services`)

### Initial Load
- [ ] Page loads without errors
- [ ] Displays "Find a Service Provider" heading
- [ ] Search bar is visible
- [ ] Shows category filter chips (All, Plumbing, Electrical, etc.)
- [ ] Providers grid loads data from backend
- [ ] Shows loading spinner during fetch
- [ ] Each provider card displays:
  - [ ] Avatar with first letter
  - [ ] Provider name
  - [ ] Availability status (green "Available" or red "Busy")
  - [ ] Rating
  - [ ] Price per hour
  - [ ] "View Profile" button
  - [ ] "Book Now" button (if available)

### Category Filtering
- [ ] Click "All" chip → shows all providers
- [ ] Click "Plumbing" chip → filters to plumbing providers only
- [ ] Click other categories → filters work correctly
- [ ] Selected chip is highlighted
- [ ] Unselecting filters works smoothly

### Booking Modal
- [ ] Not logged in → Click "Book Now" → shows "Please login" message
- [ ] Logged in → Click "Book Now" → modal appears
- [ ] Modal has:
  - [ ] Provider name in header
  - [ ] Close button (✕) works
  - [ ] Booking date input field
  - [ ] Service Type input field
  - [ ] Description textarea
  - [ ] Cancel button (closes modal)
  - [ ] Confirm Booking button
- [ ] Leave required fields empty → shows error
- [ ] Fill all fields correctly
- [ ] Click "Confirm Booking"
- [ ] See loading state
- [ ] On success → confirmation message
- [ ] Modal closes automatically
- [ ] Check MongoDB for booking created
  - Command: `db.bookings.find()` in MongoDB

## 🏢 How It Works Page (`/how-it-works`)

- [ ] Page loads properly
- [ ] Displays 4 steps with icons
- [ ] Each step has title and description
- [ ] "Find a Service Provider" button works
- [ ] Footer is visible

## 🌐 Navigation Tests

### Navbar Links
- [ ] Home link → navigates to `/`
- [ ] Services link → navigates to `/services`
- [ ] How It Works link → navigates to `/how-it-works`
- [ ] Logo/Brand name → navigates to `/`

### Redirects
- [ ] Accessing unknown URL → redirects to home
- [ ] Unauthenticated → accessing protected page → redirects to login

## 🎨 UI/UX Tests

### Visual
- [ ] Pages are responsive (resize browser window)
- [ ] Mobile view (< 768px) looks good
- [ ] Tablet view (768px - 1024px) looks good
- [ ] Desktop view (> 1024px) looks good
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Buttons have hover effects
- [ ] Forms have proper styling

### Dark Mode
- [ ] Click theme toggle button (bottom right)
- [ ] Homepage goes dark
- [ ] All pages toggle dark mode
- [ ] Toggle back to light
- [ ] Works consistently across pages

### Accessibility
- [ ] Can navigate with Tab key
- [ ] Form inputs are labeled
- [ ] Buttons are clearly visible
- [ ] Color contrast is good
- [ ] Error messages are clear

## 🔗 API Integration Tests

### Fetch Providers
- [ ] Check DevTools Network tab
- [ ] GET `/providers` request is made
- [ ] Response status is 200
- [ ] Response contains provider data
- [ ] Providers render in UI

### Search Functionality
- [ ] Enter service name in home search
- [ ] Click Search
- [ ] GET `/providers?service=X` is called
- [ ] Filtered results load
- [ ] Redirects to `/services`

### Create Booking
- [ ] Fill booking form
- [ ] Click Confirm
- [ ] Check DevTools Network
- [ ] POST `/api/bookings` request is made
- [ ] Request includes: providerId, bookingDate, serviceType, description
- [ ] Request includes Authorization header with JWT token
- [ ] Response status is 200
- [ ] Booking appears in MongoDB

### Error Handling
- [ ] Simulate network error (disconnect internet)
- [ ] API calls show error message
- [ ] App doesn't crash
- [ ] Can retry

## 🔐 Security Tests

### Token Management
- [ ] Token stored in localStorage after login
- [ ] Token included in Authorization header
- [ ] Token removed on logout
- [ ] Expired token shows 401 error

### Input Validation
- [ ] Email format validation works
- [ ] Password length validation works
- [ ] XSS attempts in forms don't execute
- [ ] SQL injection attempts fail

## ⚠️ Error Handling Tests

### Network Errors
- [ ] No internet → shows error message
- [ ] Backend down → shows error message
- [ ] Can try again without refreshing page

### Invalid Input
- [ ] Empty fields → shows validation error
- [ ] Invalid email format → shows error
- [ ] Passwords don't match → shows error
- [ ] Short password → shows error

### API Errors
- [ ] 401 Unauthorized → redirects to login
- [ ] 404 Not Found → shows error message
- [ ] 500 Server Error → shows error message

## 📱 Cross-Browser Tests

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance Tests

- [ ] First page load < 3 seconds
- [ ] Switching pages < 1 second
- [ ] API calls complete within 2 seconds
- [ ] No console errors or warnings
- [ ] No memory leaks
  - DevTools → Performance → Record & check

## 🧹 Final Checks

- [ ] No console errors (F12 → Console tab)
- [ ] No console warnings
- [ ] No 404 errors in Network tab
- [ ] All images load properly
- [ ] No broken links
- [ ] Forms submit without errors
- [ ] Logout works properly
- [ ] Token persists across browser close/reopen
- [ ] Backend logs show requests being received

## 📊 Data Verification

### Check MongoDB Collections
```javascript
// Providers
db.providers.find()

// Users
db.users.find()

// Bookings
db.bookings.find()

// Count records
db.providers.countDocuments()
db.users.countDocuments()
db.bookings.countDocuments()
```

### Check Backend Logs
```bash
# Should see:
# - HTTP requests coming in
# - Authentication logs
# - Booking creation logs
# - No error stacktraces (unless expected)
```

## ✨ Happy Path Test Scenario

Complete this flow:
1. [ ] Open http://localhost:3000
2. [ ] Click "Sign Up"
3. [ ] Create account: 
   - Name: John Doe
   - Email: john@example.com
   - Password: Test1234
4. [ ] Auto-redirect to Services
5. [ ] See "Welcome, john@example.com!" in navbar
6. [ ] Click "Book Now" on first provider
7. [ ] Fill booking:
   - Date: 2024-02-20
   - Service: Plumbing
   - Description: Fix sink leak
8. [ ] Click "Confirm Booking"
9. [ ] See success message
10. [ ] Click logout
11. [ ] Navbar shows "Log In / Sign Up"
12. [ ] Login with same credentials
13. [ ] Check MongoDB for booking record
14. [ ] All data present and correct ✓

---

## 🎯 Success Criteria

Test is **PASSED** if:
- ✅ No console errors
- ✅ All auth flows work (signup, login, logout)
- ✅ Data fetches from backend correctly
- ✅ Bookings created successfully
- ✅ Data visible in MongoDB
- ✅ UI is responsive
- ✅ Error messages are helpful
- ✅ Everything feels like a real app

---

**Run this checklist after making changes to ensure nothing breaks!**
