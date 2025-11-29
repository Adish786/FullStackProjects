package com.erp.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        name = "Role",
        description = "Defines roles and access levels in the ERP system",
        example = "ADMIN"
)
public enum Role {

    @Schema(description = "System administrator with full access")
    ADMIN,

    @Schema(description = "Sales executive responsible for managing clients and sales")
    SALES_EXECUTIVE,

    @Schema(description = "Purchase manager handling vendor and purchase operations")
    PURCHASE_MANAGER,

    @Schema(description = "Inventory manager managing stock and warehouse operations")
    INVENTORY_MANAGER,

    @Schema(description = "Accounts manager handling accounting and financial records")
    ACCOUNTANT
}
