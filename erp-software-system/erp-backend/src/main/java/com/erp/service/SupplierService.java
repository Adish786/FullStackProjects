package com.erp.service;

import com.erp.entity.Supplier;
import java.util.List;

public interface SupplierService {

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier createSupplier(Supplier supplier);

    Supplier updateSupplier(Long id, Supplier supplier);

    void deleteSupplier(Long id);

    List<Supplier> searchSuppliers(String searchTerm);

    boolean existsByName(String name);

    boolean existsByContact(String contact);
}