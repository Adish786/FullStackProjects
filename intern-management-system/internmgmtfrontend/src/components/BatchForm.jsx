import React, { useState } from 'react';
import { batchAPI } from '../services/api';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  CalendarToday,
  EventAvailable,
  Close,
  CheckCircle,
  Group,
  Schedule
} from '@mui/icons-material';
import './BatchForm.css';

const BatchForm = ({ onBatchCreated, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdBatch, setCreatedBatch] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateEndDate = (startDate) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 6);
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const validateForm = () => {
    if (!startDate) {
      setError('Please select a start date');
      return false;
    }

    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Start date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await batchAPI.create(startDate);
      setCreatedBatch(response.data);
      setSuccess('Batch created successfully!');
      setShowSuccessDialog(true);
      setStartDate('');
      
      if (onBatchCreated) {
        onBatchCreated(response.data);
      }
    } catch (err) {
      console.error('Failed to create batch:', err);
      setError('Failed to create batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setCreatedBatch(null);
    if (onClose) {
      onClose();
    }
  };

  const handleDateChange = (e) => {
    setStartDate(e.target.value);
    setError('');
  };

  const getDurationInfo = () => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const end = new Date(calculateEndDate(startDate));
    const durationInMonths = 6;
    const totalWeeks = Math.floor((end - start) / (7 * 24 * 60 * 60 * 1000));

    return {
      months: durationInMonths,
      weeks: totalWeeks,
      days: totalWeeks * 7
    };
  };

  const durationInfo = getDurationInfo();

  const renderDesktopView = () => (
    <div className="batch-form-container">
      <Paper elevation={3} className="form-paper">
        <div className="form-header">
          <div className="header-content">
            <Add className="header-icon" />
            <Typography variant="h5" className="form-title">
              Create New Batch
            </Typography>
          </div>
          {onClose && (
            <IconButton onClick={onClose} className="close-button">
              <Close />
            </IconButton>
          )}
        </div>

        {error && (
          <Alert severity="error" className="alert-message">
            {error}
          </Alert>
        )}

        {success && !showSuccessDialog && (
          <Alert severity="success" className="alert-message">
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="form-content">
          <Grid container spacing={3}>
            {/* Date Selection */}
            <Grid item xs={12} md={6}>
              <div className="date-section">
                <Typography variant="h6" className="section-title">
                  Batch Timeline
                </Typography>
                <TextField
                  fullWidth
                  label="Batch Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleDateChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  className="date-field"
                  InputProps={{
                    startAdornment: <CalendarToday className="input-icon" />
                  }}
                />
                
                {startDate && (
                  <div className="date-info">
                    <div className="info-item">
                      <EventAvailable className="info-icon" />
                      <div className="info-content">
                        <Typography variant="body2" className="info-label">
                          Start Date
                        </Typography>
                        <Typography variant="body1" className="info-value">
                          {formatDate(startDate)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Grid>

            {/* Batch Preview */}
            <Grid item xs={12} md={6}>
              <div className="preview-section">
                <Typography variant="h6" className="section-title">
                  Batch Overview
                </Typography>
                <Card className="preview-card">
                  <CardContent>
                    {startDate ? (
                      <>
                        <div className="preview-item">
                          <Schedule className="preview-icon" />
                          <div className="preview-content">
                            <Typography variant="body2" className="preview-label">
                              Duration
                            </Typography>
                            <Typography variant="body1" className="preview-value">
                              {durationInfo.months} months
                            </Typography>
                            <Typography variant="caption" className="preview-detail">
                              ({durationInfo.weeks} weeks • {durationInfo.days} days)
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="preview-item">
                          <EventAvailable className="preview-icon" />
                          <div className="preview-content">
                            <Typography variant="body2" className="preview-label">
                              End Date
                            </Typography>
                            <Typography variant="body1" className="preview-value">
                              {formatDate(calculateEndDate(startDate))}
                            </Typography>
                          </div>
                        </div>

                        <div className="batch-status">
                          <Chip 
                            label="Upcoming Batch" 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="empty-preview">
                        <Group className="empty-icon" />
                        <Typography variant="body2" className="empty-text">
                          Select a start date to see batch details
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <div className="form-actions">
            {onClose && (
              <Button
                onClick={onClose}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !startDate}
              className="submit-button"
              startIcon={loading ? null : <Add />}
            >
              {loading ? 'Creating Batch...' : 'Create Batch'}
            </Button>
          </div>
        </Box>
      </Paper>
    </div>
  );

  const renderMobileView = () => (
    <div className="batch-form-container mobile">
      <Paper elevation={2} className="form-paper mobile">
        <div className="form-header mobile">
          <div className="header-content">
            <Add className="header-icon" />
            <Typography variant="h6" className="form-title">
              New Batch
            </Typography>
          </div>
          {onClose && (
            <IconButton onClick={onClose} className="close-button" size="small">
              <Close />
            </IconButton>
          )}
        </div>

        {error && (
          <Alert severity="error" className="alert-message" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="form-content">
          <div className="mobile-form-sections">
            {/* Date Selection */}
            <div className="mobile-section">
              <Typography variant="subtitle1" className="section-title mobile">
                Start Date
              </Typography>
              <TextField
                fullWidth
                label="Select Start Date"
                type="date"
                value={startDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                required
                className="date-field mobile"
                size="small"
              />
            </div>

            {/* Batch Info */}
            {startDate && (
              <div className="mobile-section">
                <Typography variant="subtitle1" className="section-title mobile">
                  Batch Details
                </Typography>
                <Card className="preview-card mobile">
                  <CardContent className="mobile-card-content">
                    <div className="mobile-details">
                      <div className="detail-row">
                        <CalendarToday fontSize="small" />
                        <span className="detail-label">Starts:</span>
                        <span className="detail-value">{formatDate(startDate)}</span>
                      </div>
                      <div className="detail-row">
                        <EventAvailable fontSize="small" />
                        <span className="detail-label">Ends:</span>
                        <span className="detail-value">
                          {formatDate(calculateEndDate(startDate))}
                        </span>
                      </div>
                      <div className="detail-row">
                        <Schedule fontSize="small" />
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{durationInfo.months} months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions mobile">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !startDate}
              className="submit-button mobile"
              startIcon={loading ? null : <Add />}
              size="large"
            >
              {loading ? 'Creating...' : 'Create Batch'}
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                className="cancel-button mobile"
                fullWidth
                disabled={loading}
                size="large"
              >
                Cancel
              </Button>
            )}
          </div>
        </Box>
      </Paper>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccess}
        className="success-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="success-dialog-title">
          <CheckCircle className="success-icon" />
          Batch Created Successfully!
        </DialogTitle>
        <DialogContent>
          {createdBatch && (
            <div className="batch-details">
              <div className="batch-info-card">
                <div className="batch-header">
                  <Group className="batch-icon" />
                  <div className="batch-title">
                    <Typography variant="h6" className="batch-name">
                      Batch {createdBatch.id}
                    </Typography>
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small" 
                      variant="outlined" 
                    />
                  </div>
                </div>
                
                <div className="batch-timeline">
                  <div className="timeline-item">
                    <CalendarToday fontSize="small" />
                    <div className="timeline-content">
                      <Typography variant="body2" className="timeline-label">
                        Start Date
                      </Typography>
                      <Typography variant="body1" className="timeline-value">
                        {formatDate(createdBatch.startDate)}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <EventAvailable fontSize="small" />
                    <div className="timeline-content">
                      <Typography variant="body2" className="timeline-label">
                        End Date
                      </Typography>
                      <Typography variant="body1" className="timeline-value">
                        {formatDate(createdBatch.endDate)}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <Schedule fontSize="small" />
                    <div className="timeline-content">
                      <Typography variant="body2" className="timeline-label">
                        Duration
                      </Typography>
                      <Typography variant="body1" className="timeline-value">
                        6 months
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Typography variant="body2" className="success-message">
            The new batch has been created and is ready for intern assignments.
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={handleCloseSuccess} 
            className="dialog-button secondary"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              handleCloseSuccess();
              setStartDate('');
            }} 
            variant="contained"
            className="dialog-button primary"
            startIcon={<Add />}
          >
            Create Another Batch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BatchForm;