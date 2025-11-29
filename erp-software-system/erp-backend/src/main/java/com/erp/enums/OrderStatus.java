package com.erp.enums;


public enum OrderStatus {
    ORDERED("Ordered"),
    DISPATCHED("Dispatched"),
    RECEIVED("Received"),
    PARTIAL("Partial"),
    CANCELLED("Cancelled");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
