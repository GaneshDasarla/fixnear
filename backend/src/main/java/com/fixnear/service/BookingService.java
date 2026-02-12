package com.fixnear.service;

import com.fixnear.model.Booking;
import com.fixnear.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @SuppressWarnings("null")
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @SuppressWarnings("null")
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByProviderId(String providerId) {
        return bookingRepository.findByProviderId(providerId);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    @SuppressWarnings("null")
    public Booking updateBooking(String id, Booking updatedBooking) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setUserId(updatedBooking.getUserId());
                    booking.setProviderId(updatedBooking.getProviderId());
                    booking.setService(updatedBooking.getService());
                    booking.setStatus(updatedBooking.getStatus());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @SuppressWarnings("null")
    public void cancelBooking(String id) {
        bookingRepository.deleteById(id);
    }
}
