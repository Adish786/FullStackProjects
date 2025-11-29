package com.erp.enums;


public enum SalesOrderStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    DISPATCHED("Dispatched"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    private final String displayName;

    SalesOrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}