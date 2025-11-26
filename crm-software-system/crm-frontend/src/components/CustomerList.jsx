import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        loadCustomers();
        alert('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleFormSuccess = () => {
    loadCustomers();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Customers</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No Customers Found</h5>
            <p className="text-muted">Get started by adding your first customer.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Customer
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id}>
                      <td>
                        <strong>{customer.name}</strong>
                        {customer.assignedSalesRep && (
                          <small className="d-block text-muted">
                            Assigned to: {customer.assignedSalesRep.fullName}
                          </small>
                        )}
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>{customer.company || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(customer)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showForm && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleFormClose}
                ></button>
              </div>
              <div className="modal-body">
                <CustomerForm 
                  customer={editingCustomer}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;