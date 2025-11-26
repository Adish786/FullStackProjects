import React, { useState, useEffect } from 'react';
import { saleAPI, customerAPI } from '../services/api';

const SaleForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    status: 'PROPOSAL',
    date: new Date().toISOString().split('T')[0]
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await saleAPI.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="customerId" className="form-label">Customer *</label>
          <select
            className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.company || 'No Company'}
              </option>
            ))}
          </select>
          {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="amount" className="form-label">Amount ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="0.00"
          />
          {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="col-12">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="PROPOSAL">Proposal</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CLOSED_WON">Closed Won</option>
            <option value="CLOSED_LOST">Closed Lost</option>
          </select>
        </div>
      </div>

      <div className="modal-footer mt-4">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Creating...
            </>
          ) : (
            'Create Sale'
          )}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;