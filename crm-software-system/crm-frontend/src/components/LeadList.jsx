import React, { useState, useEffect } from 'react';
import { leadAPI } from '../services/api';
import LeadForm from './LeadForm';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(id);
        loadLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: 'bg-primary',
      CONTACTED: 'bg-warning',
      CONVERTED: 'bg-success',
      LOST: 'bg-danger'
    };
    return statusConfig[status] || 'bg-secondary';
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      REFERRAL: 'bg-info',
      ADS: 'bg-success',
      WEB: 'bg-primary'
    };
    return sourceConfig[source] || 'bg-secondary';
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
        <h2 className="text-primary">Leads Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add Lead
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No Leads Found</h5>
            <p className="text-muted">Start by adding your first lead.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Lead
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
                    <th>Contact Info</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name}</strong>
                      </td>
                      <td>{lead.contactInfo}</td>
                      <td>
                        <span className={`badge ${getSourceBadge(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        {lead.assignedSalesRep ? lead.assignedSalesRep.fullName : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(lead.id)}
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

      {showForm && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Lead</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <LeadForm 
                  onSuccess={() => {
                    loadLeads();
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;