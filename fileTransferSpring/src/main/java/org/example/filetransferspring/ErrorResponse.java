package org.example.filetransferspring;

public class ErrorResponse {
    private final String message;
    private final long timestamp;

    public ErrorResponse(String message) {
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    // Геттеры
    public String getMessage() {
        return message;
    }

    public long getTimestamp() {
        return timestamp;
    }
}