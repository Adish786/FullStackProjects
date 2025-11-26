import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      HIGH: 'bg-danger',
      MEDIUM: 'bg-warning',
      LOW: 'bg-info'
    };
    return priorityConfig[priority] || 'bg-secondary';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: 'bg-primary',
      IN_PROGRESS: 'bg-warning',
      COMPLETED: 'bg-success'
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
        <h2 className="text-primary">Task Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No Tasks Found</h5>
            <p className="text-muted">Create your first task to get started.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Task
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
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                      </td>
                      <td>{task.description || '-'}</td>
                      <td>{task.dueDate || '-'}</td>
                      <td>
                        <span className={`badge ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        {task.assignedTo ? task.assignedTo.fullName : '-'}
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
                <h5 className="modal-title">Add New Task</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <TaskForm 
                  onSuccess={() => {
                    loadTasks();
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

export default TaskList;