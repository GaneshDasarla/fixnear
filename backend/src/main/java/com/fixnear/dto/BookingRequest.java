package com.fixnear.dto;

import java.time.LocalDateTime;

public class BookingRequest {
    private String userId;
    private String providerId;
    private LocalDateTime bookingDate;
    private String serviceType;
    private String description;

    public BookingRequest() {
    }

    public BookingRequest(String userId, String providerId, LocalDateTime bookingDate, String serviceType, String description) {
        this.userId = userId;
        this.providerId = providerId;
        this.bookingDate = bookingDate;
        this.serviceType = serviceType;
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
