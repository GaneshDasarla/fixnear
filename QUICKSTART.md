# 🚀 Quick Start - FixNear Full Stack

## ⏱️ Get Running in 5 Minutes

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
✅ Backend running on http://localhost:8081

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000

### Step 3: Test the App
```
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create account:
   - Name: John Doe
   - Email: john@test.com
   - Password: Test1234
4. Auto-redirect to services
5. Click "Book Now" on a provider
6. Fill booking form and submit
7. ✅ Done! Booking saved in MongoDB
```

---

## 📋 What's Included

| Component | Status |
|-----------|--------|
| Backend (JWT, MongoDB) | ✅ Ready |
| Frontend (React SPA) | ✅ Ready |
| Authentication | ✅ Works |
| Browse Services | ✅ Works |
| Book Services | ✅ Works |
| User Dashboard | ⏳ Optional |
| Payments | ⏳ Optional |
| Real-time Chat | ⏳ Optional |

---

## 🎯 All Features Implemented

✅ **User Authentication**
- Signup with email & password
- Login
- Logout
- Token management

✅ **Service Management**
- Browse all providers
- Filter by category
- Search by service name
- View provider details

✅ **Booking System**
- Book provider in modal
- Select date & service type
- Add description
- Submit booking
- Booking saved to MongoDB

✅ **User Interface**
- Responsive design
- Dark mode
- Loading states
- Error messages
- User menu

✅ **Backend Integration**
- All APIs connected
- Real MongoDB data
- JWT authentication
- CORS enabled

---

## 🔗 Important Files

**Frontend:**
- `src/context/AuthContext.js` - Authentication logic
- `src/services/apiService.js` - API integration
- `src/pages/Services.js` - Booking functionality

**Backend:**
- `src/main/java/com/fixnear/controller/AuthController.java` - Login/Signup
- `src/main/java/com/fixnear/controller/ProviderController.java` - Providers
- `src/main/java/com/fixnear/controller/BookingController.java` - Bookings

---

## 🐛 Troubleshooting

**Frontend won't connect to backend?**
```
→ Check backend is running on port 8081
→ Check .env file: REACT_APP_API_BASE=http://localhost:8081
```

**Booking button doesn't work?**
```
→ You must be logged in first
→ Click "Sign Up" or "Log In"
```

**No providers showing?**
```
→ Add sample data to MongoDB:
   db.providers.insertMany([
     {name: "John", service: "Plumbing", available: true, rating: 4.8, price: 50},
     {name: "Jane", service: "Electrical", available: true, rating: 4.9, price: 60}
   ])
```

**Token issues?**
```
→ Check browser DevTools → Application → LocalStorage
→ Token should be saved there
```

---

## 📖 Read These Docs

1. **IMPLEMENTATION_SUMMARY.md** - Overview of everything
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **QUICK_REFERENCE.md** - API functions reference
4. **TESTING_CHECKLIST.md** - Complete test scenarios

---

## 🎓 How to Extend

### Add a New Feature
1. Create component in `src/components/`
2. Add route in `src/App.js`
3. Import and use

### Add API Endpoint
1. Add method in `src/services/apiService.js`
2. Call it from component using `useEffect`
3. Update backend controller

### Change Styling
1. Edit `src/styles/main.css`
2. All pages use these styles
3. Dark mode styles included

### Add Protected Page
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 💾 Sample Data

### Add Providers
```javascript
db.providers.insertOne({
  name: "John Smith",
  service: "Plumbing",
  available: true,
  rating: 4.8,
  price: 50
})
```

### View Bookings
```javascript
db.bookings.find().pretty()
```

### View Users
```javascript
db.users.find().pretty()
```

---

## 🔐 Default Credentials

After signup, use your test account:
- Email: john@test.com
- Password: Test1234

---

## 🎉 You Now Have

- ✅ Full-stack application
- ✅ Real authentication system
- ✅ Working booking system
- ✅ Database integration
- ✅ Production-ready code
- ✅ Complete documentation

**Everything works like a real service! 🚀**

---

## 📊 Tech Stack

**Frontend:**
- React 19
- React Router v7
- Context API
- CSS3

**Backend:**
- Spring Boot 3.5.10
- MongoDB
- JWT Authentication
- Maven

**Database:**
- MongoDB

---

## 📱 Works On

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Dark Mode
- ✅ All Browsers

---

## 🚀 Start Now!

```bash
# Terminal 1:
cd backend
mvn spring-boot:run

# Terminal 2:
cd frontend
npm start

# Then open: http://localhost:3000
```

**That's it! Your app is running!** ✨
