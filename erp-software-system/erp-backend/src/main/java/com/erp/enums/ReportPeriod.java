package com.erp.enums;

public enum ReportPeriod {
    DAILY("DAILY"),
    WEEKLY("WEEKLY"),
    MONTHLY("MONTHLY"),
    QUARTERLY("QUARTERLY"),
    YEARLY("YEARLY");

    private final String value;

    ReportPeriod(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}