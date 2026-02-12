package com.fixnear.dto;

public class AuthResponse {
    private String message;
    private String token;
    private String userId;
    private String userName;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public AuthResponse(String message, String token, String userId, String userName, String email) {
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
