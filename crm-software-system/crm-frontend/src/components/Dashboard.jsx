import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth';
import { customerAPI, leadAPI, taskAPI, saleAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    tasks: 0,
    sales: 0
  });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [customersRes, leadsRes, tasksRes, salesRes] = await Promise.all([
        customerAPI.getAll(),
        leadAPI.getAll(),
        taskAPI.getAll(),
        saleAPI.getAll()
      ]);

      setStats({
        customers: customersRes.data.length,
        leads: leadsRes.data.length,
        tasks: tasksRes.data.length,
        sales: salesRes.data.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Dashboard</h2>
            <span className="text-muted">Welcome back, {user?.email}</span>
          </div>
          
          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card text-white bg-primary h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="card-title">{stats.customers}</h4>
                      <p className="card-text mb-0">Total Customers</p>
                    </div>
                    <i className="fas fa-users fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card text-white bg-success h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="card-title">{stats.leads}</h4>
                      <p className="card-text mb-0">Active Leads</p>
                    </div>
                    <i className="fas fa-bullseye fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card text-white bg-warning h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="card-title">{stats.tasks}</h4>
                      <p className="card-text mb-0">Pending Tasks</p>
                    </div>
                    <i className="fas fa-tasks fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card text-white bg-info h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="card-title">{stats.sales}</h4>
                      <p className="card-text mb-0">Sales Pipeline</p>
                    </div>
                    <i className="fas fa-chart-line fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <a href="/customers" className="btn btn-outline-primary w-100">
                        <i className="fas fa-users me-2"></i>
                        Manage Customers
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/leads" className="btn btn-outline-success w-100">
                        <i className="fas fa-bullseye me-2"></i>
                        View Leads
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/tasks" className="btn btn-outline-warning w-100">
                        <i className="fas fa-tasks me-2"></i>
                        My Tasks
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/sales" className="btn btn-outline-info w-100">
                        <i className="fas fa-chart-line me-2"></i>
                        Sales Pipeline
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;