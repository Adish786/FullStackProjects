import React, { useState, useEffect } from 'react';
import { saleAPI } from '../services/api';
import SaleForm from './SaleForm';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await saleAPI.getAll();
      setSales(response.data);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PROPOSAL: 'bg-primary',
      NEGOTIATION: 'bg-warning',
      CLOSED_WON: 'bg-success',
      CLOSED_LOST: 'bg-danger'
    };
    return statusConfig[status] || 'bg-secondary';
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
        <h2 className="text-primary">Sales Pipeline</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add Sale
        </button>
      </div>

      {sales.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No Sales Records Found</h5>
            <p className="text-muted">Start tracking your sales pipeline.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Sale
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
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Sales Rep</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id}>
                      <td>
                        <strong>{sale.customer?.name}</strong>
                      </td>
                      <td>${sale.amount}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td>{sale.date}</td>
                      <td>
                        {sale.assignedSalesRep ? sale.assignedSalesRep.fullName : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-outline-danger">
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
                <h5 className="modal-title">Add New Sale</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <SaleForm 
                  onSuccess={() => {
                    loadSales();
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

export default SaleList;