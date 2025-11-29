package com.erp.service.impl;

import com.erp.entity.Supplier;
import com.erp.repository.SupplierRepository;
import com.erp.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Supplier getSupplierById(Long id) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        if (supplier.isEmpty()) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        return supplier.get();
    }

    @Override
    public Supplier createSupplier(Supplier supplier) {
        // Check if supplier with same name already exists
        if (supplierRepository.existsByName(supplier.getName())) {
            throw new RuntimeException("Supplier with name '" + supplier.getName() + "' already exists");
        }

        // Check if contact email already exists
        if (supplierRepository.existsByContact(supplier.getContact())) {
            throw new RuntimeException("Supplier with contact email '" + supplier.getContact() + "' already exists");
        }

        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier existingSupplier = getSupplierById(id);

        // Check if name is being changed and conflicts with another supplier
        if (!existingSupplier.getName().equals(supplierDetails.getName()) &&
                supplierRepository.existsByName(supplierDetails.getName())) {
            throw new RuntimeException("Supplier with name '" + supplierDetails.getName() + "' already exists");
        }

        // Check if contact is being changed and conflicts with another supplier
        if (!existingSupplier.getContact().equals(supplierDetails.getContact()) &&
                supplierRepository.existsByContact(supplierDetails.getContact())) {
            throw new RuntimeException("Supplier with contact '" + supplierDetails.getContact() + "' already exists");
        }

        // Update fields
        existingSupplier.setName(supplierDetails.getName());
        existingSupplier.setContact(supplierDetails.getContact());
        existingSupplier.setPhone(supplierDetails.getPhone());
        existingSupplier.setAddress(supplierDetails.getAddress());
        existingSupplier.setNotes(supplierDetails.getNotes());

        return supplierRepository.save(existingSupplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> searchSuppliers(String searchTerm) {
        return supplierRepository.findByNameContainingIgnoreCase(searchTerm);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return supplierRepository.existsByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByContact(String contact) {
        return supplierRepository.existsByContact(contact);
    }
}