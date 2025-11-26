import React, { useState, useEffect } from 'react';
import { batchAPI, internAPI } from '../services/api';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Group,
  CalendarToday,
  EventAvailable,
  People,
  CardMembership,
  Email,
  Phone,
  Badge,
  Visibility,
  Refresh
} from '@mui/icons-material';
import './BatchList.css';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [batchInterns, setBatchInterns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await batchAPI.getAll();
      setBatches(response.data);
      
      // Load interns for each batch
      const internsMap = {};
      for (const batch of response.data) {
        try {
          const internsResponse = await internAPI.getByBatch(batch.id);
          internsMap[batch.id] = internsResponse.data;
        } catch (err) {
          console.error(`Failed to load interns for batch ${batch.id}:`, err);
          internsMap[batch.id] = [];
        }
      }
      setBatchInterns(internsMap);
    } catch (err) {
      console.error('Failed to load batches:', err);
      setError('Failed to load batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchClick = (batch) => {
    if (isMobile) {
      setSelectedBatch(batch);
      setDetailDialog(true);
    } else {
      setExpandedBatch(expandedBatch === batch.id ? null : batch.id);
    }
  };

  const handleCloseDialog = () => {
    setDetailDialog(false);
    setSelectedBatch(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBatchProgress = (batch) => {
    const start = new Date(batch.startDate);
    const end = new Date(batch.endDate);
    const today = new Date();
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  const getBatchStatus = (batch) => {
    const start = new Date(batch.startDate);
    const end = new Date(batch.endDate);
    const today = new Date();
    
    if (today < start) return { status: 'upcoming', color: 'default' };
    if (today > end) return { status: 'completed', color: 'success' };
    return { status: 'active', color: 'primary' };
  };

  const renderDesktopView = () => (
    <div className="batch-list-container">
      <div className="list-header">
        <div className="header-content">
          <Group className="header-icon" />
          <Typography variant="h4" className="list-title">
            Batch Management
          </Typography>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <Typography variant="h6" className="stat-number">
              {batches.length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Total Batches
            </Typography>
          </div>
          <div className="stat-item">
            <Typography variant="h6" className="stat-number">
              {Object.values(batchInterns).flat().length}
            </Typography>
            <Typography variant="body2" className="stat-label">
              Total Interns
            </Typography>
          </div>
        </div>
      </div>

      {batches.length === 0 && !loading ? (
        <Paper className="empty-state">
          <Group className="empty-icon" />
          <Typography variant="h6" className="empty-title">
            No Batches Created Yet
          </Typography>
          <Typography variant="body2" className="empty-description">
            Create your first batch to start managing interns
          </Typography>
        </Paper>
      ) : (
        <div className="batches-grid">
          {batches.map(batch => {
            const interns = batchInterns[batch.id] || [];
            const status = getBatchStatus(batch);
            const progress = getBatchProgress(batch);
            const isExpanded = expandedBatch === batch.id;

            return (
              <Paper key={batch.id} className="batch-card">
                <div 
                  className={`batch-header ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => handleBatchClick(batch)}
                >
                  <div className="batch-basic-info">
                    <div className="batch-title-section">
                      <Typography variant="h6" className="batch-name">
                        Batch {batch.id}
                      </Typography>
                      <Chip 
                        label={status.status.toUpperCase()} 
                        color={status.color}
                        size="small"
                        className="status-chip"
                      />
                    </div>
                    
                    <div className="batch-dates">
                      <div className="date-item">
                        <CalendarToday className="date-icon" />
                        <Typography variant="body2" className="date-label">
                          Start: {formatDate(batch.startDate)}
                        </Typography>
                      </div>
                      <div className="date-item">
                        <EventAvailable className="date-icon" />
                        <Typography variant="body2" className="date-label">
                          End: {formatDate(batch.endDate)}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="batch-stats">
                    <div className="stat">
                      <People className="stat-icon" />
                      <div className="stat-content">
                        <Typography variant="h6" className="stat-number">
                          {interns.length}
                        </Typography>
                        <Typography variant="caption" className="stat-label">
                          Interns
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <Typography variant="caption" className="progress-text">
                        {progress}% Complete
                      </Typography>
                    </div>

                    <IconButton 
                      className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                      size="small"
                    >
                      <ExpandMore />
                    </IconButton>
                  </div>
                </div>

                {isExpanded && (
                  <div className="batch-details">
                    {interns.length > 0 ? (
                      <>
                        <Typography variant="subtitle1" className="interns-title">
                          Interns in this Batch ({interns.length})
                        </Typography>
                        <div className="interns-table">
                          <table className="interns-table-content">
                            <thead>
                              <tr>
                                <th className="column-id">ID</th>
                                <th className="column-name">Name</th>
                                <th className="column-email">Email</th>
                                <th className="column-phone">Phone</th>
                                <th className="column-card">ID Card</th>
                                <th className="column-join">Join Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {interns.map(intern => (
                                <tr key={intern.id} className="intern-row">
                                  <td className="column-id">
                                    <Badge className="id-badge" />
                                    <span className="intern-id">{intern.internId}</span>
                                  </td>
                                  <td className="column-name">
                                    <span className="intern-name">{intern.name}</span>
                                  </td>
                                  <td className="column-email">
                                    <Email className="email-icon" />
                                    <span className="intern-email">{intern.email}</span>
                                  </td>
                                  <td className="column-phone">
                                    <Phone className="phone-icon" />
                                    <span className="intern-phone">{intern.mobileNumber}</span>
                                  </td>
                                  <td className="column-card">
                                    <Chip 
                                      label={intern.idCardType}
                                      size="small"
                                      className={`card-chip ${intern.idCardType.toLowerCase()}`}
                                    />
                                  </td>
                                  <td className="column-join">
                                    <span className="join-date">
                                      {formatDate(intern.dateOfJoining)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="no-interns">
                        <People className="no-interns-icon" />
                        <Typography variant="body1" className="no-interns-text">
                          No interns assigned to this batch yet
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </Paper>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderMobileView = () => (
    <div className="batch-list-container mobile">
      <div className="list-header mobile">
        <div className="header-content">
          <Group className="header-icon" />
          <div>
            <Typography variant="h5" className="list-title">
              Batches
            </Typography>
            <Typography variant="body2" className="list-subtitle">
              {batches.length} batches • {Object.values(batchInterns).flat().length} interns
            </Typography>
          </div>
        </div>
        <IconButton onClick={loadBatches} className="refresh-button" disabled={loading}>
          <Refresh />
        </IconButton>
      </div>

      {batches.length === 0 && !loading ? (
        <Paper className="empty-state mobile">
          <Group className="empty-icon" />
          <Typography variant="h6" className="empty-title">
            No Batches
          </Typography>
          <Typography variant="body2" className="empty-description">
            Create your first batch to get started
          </Typography>
        </Paper>
      ) : (
        <div className="mobile-batches-list">
          {batches.map(batch => {
            const interns = batchInterns[batch.id] || [];
            const status = getBatchStatus(batch);
            const progress = getBatchProgress(batch);

            return (
              <Paper 
                key={batch.id} 
                className="mobile-batch-card"
                onClick={() => handleBatchClick(batch)}
              >
                <div className="mobile-card-header">
                  <div className="mobile-batch-info">
                    <div className="mobile-batch-title">
                      <Typography variant="subtitle1" className="mobile-batch-name">
                        Batch {batch.id}
                      </Typography>
                      <Chip 
                        label={status.status} 
                        color={status.color}
                        size="small"
                        className="mobile-status-chip"
                      />
                    </div>
                    
                    <div className="mobile-batch-dates">
                      <div className="mobile-date-row">
                        <CalendarToday fontSize="small" />
                        <Typography variant="caption" className="mobile-date">
                          {formatDate(batch.startDate)}
                        </Typography>
                      </div>
                      <div className="mobile-date-row">
                        <EventAvailable fontSize="small" />
                        <Typography variant="caption" className="mobile-date">
                          {formatDate(batch.endDate)}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="mobile-batch-stats">
                    <div className="mobile-intern-count">
                      <People fontSize="small" />
                      <Typography variant="h6" className="mobile-count">
                        {interns.length}
                      </Typography>
                    </div>
                    <ExpandMore className="view-icon" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mobile-progress-section">
                  <div className="mobile-progress-bar">
                    <div 
                      className="mobile-progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <Typography variant="caption" className="mobile-progress-text">
                    {progress}% complete
                  </Typography>
                </div>

                {/* Quick Intern Preview */}
                {interns.length > 0 && (
                  <div className="mobile-interns-preview">
                    <Typography variant="caption" className="preview-label">
                      Interns:
                    </Typography>
                    <div className="preview-interns">
                      {interns.slice(0, 3).map(intern => (
                        <Chip
                          key={intern.id}
                          label={intern.name}
                          size="small"
                          variant="outlined"
                          className="preview-chip"
                        />
                      ))}
                      {interns.length > 3 && (
                        <Chip
                          label={`+${interns.length - 3} more`}
                          size="small"
                          className="more-chip"
                        />
                      )}
                    </div>
                  </div>
                )}
              </Paper>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderBatchDetailDialog = () => (
    <Dialog
      open={detailDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      className="batch-detail-dialog"
    >
      {selectedBatch && (
        <>
          <DialogTitle className="dialog-title">
            <div className="dialog-header">
              <div className="dialog-batch-info">
                <Typography variant="h5" className="dialog-batch-name">
                  Batch {selectedBatch.id}
                </Typography>
                <Chip 
                  label={getBatchStatus(selectedBatch).status.toUpperCase()} 
                  color={getBatchStatus(selectedBatch).color}
                  className="dialog-status-chip"
                />
              </div>
              <IconButton onClick={handleCloseDialog} className="dialog-close">
                <ExpandMore />
              </IconButton>
            </div>
          </DialogTitle>
          
          <DialogContent className="dialog-content">
            {/* Batch Timeline */}
            <div className="dialog-timeline">
              <div className="timeline-item">
                <CalendarToday className="timeline-icon" />
                <div className="timeline-content">
                  <Typography variant="body2" className="timeline-label">
                    Start Date
                  </Typography>
                  <Typography variant="body1" className="timeline-value">
                    {formatDate(selectedBatch.startDate)}
                  </Typography>
                </div>
              </div>
              
              <div className="timeline-item">
                <EventAvailable className="timeline-icon" />
                <div className="timeline-content">
                  <Typography variant="body2" className="timeline-label">
                    End Date
                  </Typography>
                  <Typography variant="body1" className="timeline-value">
                    {formatDate(selectedBatch.endDate)}
                  </Typography>
                </div>
              </div>
              
              <div className="timeline-item">
                <People className="timeline-icon" />
                <div className="timeline-content">
                  <Typography variant="body2" className="timeline-label">
                    Total Interns
                  </Typography>
                  <Typography variant="body1" className="timeline-value">
                    {batchInterns[selectedBatch.id]?.length || 0}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="dialog-progress">
              <div className="progress-header">
                <Typography variant="subtitle2" className="progress-label">
                  Batch Progress
                </Typography>
                <Typography variant="body2" className="progress-percent">
                  {getBatchProgress(selectedBatch)}%
                </Typography>
              </div>
              <div className="dialog-progress-bar">
                <div 
                  className="dialog-progress-fill"
                  style={{ width: `${getBatchProgress(selectedBatch)}%` }}
                ></div>
              </div>
            </div>

            {/* Interns List */}
            <div className="dialog-interns">
              <Typography variant="h6" className="interns-title">
                Interns ({batchInterns[selectedBatch.id]?.length || 0})
              </Typography>
              
              {batchInterns[selectedBatch.id]?.length > 0 ? (
                <div className="mobile-interns-list">
                  {batchInterns[selectedBatch.id].map(intern => (
                    <Paper key={intern.id} className="mobile-intern-card">
                      <div className="mobile-intern-header">
                        <div className="mobile-intern-basic">
                          <Typography variant="subtitle1" className="mobile-intern-name">
                            {intern.name}
                          </Typography>
                          <Chip 
                            label={intern.idCardType}
                            size="small"
                            className={`mobile-card-chip ${intern.idCardType.toLowerCase()}`}
                          />
                        </div>
                        <Typography variant="caption" className="mobile-intern-id">
                          {intern.internId}
                        </Typography>
                      </div>
                      
                      <div className="mobile-intern-details">
                        <div className="mobile-detail-row">
                          <Email fontSize="small" />
                          <Typography variant="body2" className="mobile-detail-value">
                            {intern.email}
                          </Typography>
                        </div>
                        <div className="mobile-detail-row">
                          <Phone fontSize="small" />
                          <Typography variant="body2" className="mobile-detail-value">
                            {intern.mobileNumber}
                          </Typography>
                        </div>
                        <div className="mobile-detail-row">
                          <CalendarToday fontSize="small" />
                          <Typography variant="body2" className="mobile-detail-value">
                            Joined {formatDate(intern.dateOfJoining)}
                          </Typography>
                        </div>
                      </div>
                    </Paper>
                  ))}
                </div>
              ) : (
                <div className="dialog-no-interns">
                  <People className="no-interns-icon" />
                  <Typography variant="body1" className="no-interns-text">
                    No interns in this batch
                  </Typography>
                </div>
              )}
            </div>
          </DialogContent>
          
          <DialogActions className="dialog-actions">
            <Button onClick={handleCloseDialog} className="close-dialog-button">
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} className="loading-spinner" />
        <Typography variant="h6" className="loading-text">
          Loading batches...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
        <Button 
          onClick={loadBatches} 
          variant="contained" 
          className="retry-button"
          startIcon={<Refresh />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      {renderBatchDetailDialog()}
    </>
  );
};

export default BatchList;