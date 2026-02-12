package com.fixnear.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fixnear.dto.BookingRequest;
import com.fixnear.dto.BookingResponse;
import com.fixnear.model.Booking;
import com.fixnear.model.Provider;
import com.fixnear.model.User;
import com.fixnear.service.BookingService;
import com.fixnear.service.ProviderService;
import com.fixnear.service.UserService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProviderService providerService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            // Validate required fields
            if (request.getUserId() == null || request.getUserId().isEmpty()) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (request.getProviderId() == null || request.getProviderId().isEmpty()) {
                return ResponseEntity.badRequest().body("Provider ID is required");
            }

            // Validate user exists
            if (!userService.getUserById(request.getUserId()).isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Validate provider exists
            if (!providerService.getProviderById(request.getProviderId()).isPresent()) {
                return ResponseEntity.badRequest().body("Provider not found");
            }

            User user = userService.getUserById(request.getUserId()).get();
            Provider provider = providerService.getProviderById(request.getProviderId()).get();

            Booking booking = new Booking();
            booking.setUserId(request.getUserId());
            booking.setUserName(user.getName());
            booking.setProviderId(request.getProviderId());
            booking.setProviderName(provider.getName());
            booking.setService(provider.getService());
            booking.setLocation(provider.getLocation());
            booking.setPrice(provider.getPrice());
            booking.setStatus("PENDING");
            booking.setDescription(request.getDescription());
            // Convert LocalDateTime to Date properly
            if (request.getBookingDate() != null) {
                Date bookingDate = java.sql.Timestamp.valueOf(request.getBookingDate());
                booking.setBookingDate(bookingDate);
            }
            booking.setCreatedAt(new Date());
            booking.setUpdatedAt(new Date());

            Booking createdBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(convertToResponse(createdBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating booking: " + e.getMessage());
        }
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable String id) {
        try {
            return bookingService.getBookingById(id)
                    .map(booking -> ResponseEntity.ok(convertToResponse(booking)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving booking: " + e.getMessage());
        }
    }

    // Get bookings by userId or providerId (supports both path and query params)
    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String providerId) {
        try {
            if (userId != null && !userId.isEmpty()) {
                List<Booking> bookings = bookingService.getBookingsByUserId(userId);
                return ResponseEntity.ok(bookings.stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList()));
            } else if (providerId != null && !providerId.isEmpty()) {
                List<Booking> bookings = bookingService.getBookingsByProviderId(providerId);
                return ResponseEntity.ok(bookings.stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList()));
            }
            // If neither parameter provided, return all bookings (for admin)
            List<Booking> allBookings = bookingService.getAllBookings();
            return ResponseEntity.ok(allBookings.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving bookings: " + e.getMessage());
        }
    }

    // Get bookings for current user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable String userId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(bookings.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving bookings: " + e.getMessage());
        }
    }

    // Get bookings for a provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> getProviderBookings(@PathVariable String providerId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByProviderId(providerId);
            return ResponseEntity.ok(bookings.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving bookings: " + e.getMessage());
        }
    }

    // Update booking status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody StatusUpdateRequest statusRequest) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            String raw = statusRequest.getStatus();
            if (raw == null || raw.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            String s = raw.trim().toUpperCase();
            // normalize common synonyms
            String mapped;
            switch (s) {
                case "ACCEPT":
                case "ACCEPTED":
                    mapped = "ACCEPTED";
                    break;
                case "REJECT":
                case "REJECTED":
                    mapped = "REJECTED";
                    break;
                case "COMPLETE":
                case "COMPLETED":
                    mapped = "COMPLETED";
                    break;
                case "CANCEL":
                case "CANCELLED":
                case "CANCELED":
                    mapped = "CANCELLED";
                    break;
                case "PENDING":
                case "REQUESTED":
                    mapped = "PENDING";
                    break;
                default:
                    // Accept unknown status but uppercase it
                    mapped = s;
            }
            booking.setStatus(mapped);
            booking.setUpdatedAt(new Date());
            Booking updatedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(convertToResponse(updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating booking: " + e.getMessage());
        }
    }

    // Add review and rating to a completed booking
    @PutMapping("/{id}/review")
    public ResponseEntity<?> addReview(@PathVariable String id, @RequestBody ReviewRequest reviewRequest) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setRating((int) reviewRequest.getRating());
            booking.setReview(reviewRequest.getReview());
            booking.setStatus("COMPLETED");
            booking.setUpdatedAt(new Date());
            Booking updatedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(convertToResponse(updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding review: " + e.getMessage());
        }
    }

    // Cancel booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus("CANCELLED");
            booking.setUpdatedAt(new Date());
            bookingService.createBooking(booking);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error cancelling booking: " + e.getMessage());
        }
    }

    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setProviderId(booking.getProviderId());
        response.setUserName(booking.getUserName());
        response.setProviderName(booking.getProviderName());
        response.setService(booking.getService());
        response.setLocation(booking.getLocation());
        response.setPrice(booking.getPrice());
        response.setStatus(booking.getStatus());
        response.setBookingDate(booking.getBookingDate());
        response.setDescription(booking.getDescription());
        response.setRating((int) booking.getRating());
        response.setReview(booking.getReview());
        return response;
    }

    public static class ReviewRequest {
        private double rating;
        private String review;

        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }

        public String getReview() { return review; }
        public void setReview(String review) { this.review = review; }
    }

    public static class StatusUpdateRequest {
        private String status;
        private String reason;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
