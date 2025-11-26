import React, { useState } from 'react';
import { leadAPI } from '../services/api';

const LeadForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    source: 'WEB',
    status: 'NEW'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
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
      await leadAPI.create(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="name" className="form-label">Lead Name *</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter lead name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="contactInfo" className="form-label">Contact Information *</label>
          <input
            type="text"
            className={`form-control ${errors.contactInfo ? 'is-invalid' : ''}`}
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Email or phone number"
          />
          {errors.contactInfo && <div className="invalid-feedback">{errors.contactInfo}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="source" className="form-label">Source</label>
          <select
            className="form-select"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="WEB">Web</option>
            <option value="ADS">Ads</option>
            <option value="REFERRAL">Referral</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
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
            'Create Lead'
          )}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;