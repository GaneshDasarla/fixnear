package com.fixnear.controller;

import com.fixnear.model.Booking;
import com.fixnear.model.Provider;
import com.fixnear.model.User;
import com.fixnear.service.BookingService;
import com.fixnear.service.ProviderService;
import com.fixnear.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProviderService providerService;

    @Autowired
    private BookingService bookingService;

    // ✅ GET ADMIN DASHBOARD WITH STATISTICS
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            Map<String, Object> dashboard = new HashMap<>();

            // Get statistics
            List<User> allUsers = userService.getAllUsers();
            List<Provider> allProviders = providerService.getAllProviders();
            List<Booking> allBookings = bookingService.getAllBookings();

            dashboard.put("totalUsers", allUsers.size());
            dashboard.put("totalProviders", allProviders.size());
            dashboard.put("totalBookings", allBookings.size());

            // Count bookings by status
            long completedBookings = allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .count();
            long pendingBookings = allBookings.stream()
                    .filter(b -> "PENDING".equals(b.getStatus()))
                    .count();
            long confirmedBookings = allBookings.stream()
                    .filter(b -> "CONFIRMED".equals(b.getStatus()))
                    .count();

            dashboard.put("completedBookings", completedBookings);
            dashboard.put("pendingBookings", pendingBookings);
            dashboard.put("confirmedBookings", confirmedBookings);

            // Average provider rating
            double avgRating = allProviders.stream()
                    .mapToDouble(Provider::getRating)
                    .average()
                    .orElse(0.0);
            dashboard.put("averageProviderRating", avgRating);

            // Active providers
            long activeProviders = allProviders.stream()
                    .filter(Provider::isAvailable)
                    .count();
            dashboard.put("activeProviders", activeProviders);

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving dashboard: " + e.getMessage());
        }
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    // ✅ GET USER BY ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return userService.getUserById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user: " + e.getMessage());
        }
    }

    // ✅ DELETE USER
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    // ✅ DISABLE/ENABLE USER
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id, @RequestParam boolean enabled) {
        try {
            User updatedUser = userService.toggleUserStatus(id, enabled);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user status: " + e.getMessage());
        }
    }

    // ✅ GET ALL PROVIDERS (Admin view)
    @GetMapping("/providers")
    public ResponseEntity<?> getAllProviders() {
        try {
            return ResponseEntity.ok(providerService.getAllProviders());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving providers: " + e.getMessage());
        }
    }

    // ✅ DELETE PROVIDER
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable String id) {
        try {
            providerService.deleteProvider(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting provider: " + e.getMessage());
        }
    }

    // ✅ GET ALL BOOKINGS (Admin view)
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            return ResponseEntity.ok(bookingService.getAllBookings());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving bookings: " + e.getMessage());
        }
    }

    // ✅ GET BOOKINGS BY STATUS
    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving bookings: " + e.getMessage());
        }
    }

    // ✅ MANAGE BOOKING STATUS (Cancel, Confirm, etc.)
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        try {
            return bookingService.getBookingById(id)
                    .map(booking -> {
                        booking.setStatus(status);
                        booking.setUpdatedAt(new Date());
                        Booking updated = bookingService.createBooking(booking);
                        return ResponseEntity.ok(updated);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating booking: " + e.getMessage());
        }
    }

    // ✅ GET ANALYTICS DATA
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        try {
            Map<String, Object> analytics = new HashMap<>();

            List<User> allUsers = userService.getAllUsers();
            List<Provider> allProviders = providerService.getAllProviders();
            List<Booking> allBookings = bookingService.getAllBookings();

            // User statistics
            analytics.put("totalUsers", allUsers.size());
            long enabledUsers = allUsers.stream().filter(User::isEnabled).count();
            analytics.put("enabledUsers", enabledUsers);
            analytics.put("disabledUsers", allUsers.size() - enabledUsers);

            // Provider statistics
            analytics.put("totalProviders", allProviders.size());
            long availableProviders = allProviders.stream().filter(Provider::isAvailable).count();
            analytics.put("availableProviders", availableProviders);

            // Booking statistics
            analytics.put("totalBookings", allBookings.size());
            long completedBookings = allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .count();
            long cancelledBookings = allBookings.stream()
                    .filter(b -> "CANCELLED".equals(b.getStatus()))
                    .count();
            analytics.put("completedBookings", completedBookings);
            analytics.put("cancelledBookings", cancelledBookings);

            // Service statistics
            Map<String, Long> serviceCount = allProviders.stream()
                    .collect(Collectors.groupingBy(Provider::getService, Collectors.counting()));
            analytics.put("serviceBreakdown", serviceCount);

            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving analytics: " + e.getMessage());
        }
    }
}
