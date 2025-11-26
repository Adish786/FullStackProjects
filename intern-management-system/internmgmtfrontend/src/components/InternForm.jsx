import React, { useState, useEffect } from 'react';
import { internAPI, batchAPI } from '../services/api';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close,
  PersonAdd,
  Edit,
  CheckCircle
} from '@mui/icons-material';
import './InternForm.css';

const InternForm = ({ onInternCreated, editIntern, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    idCardType: 'FREE',
    dateOfJoining: '',
    batch: { id: '' }
  });
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ['Personal Info', 'Contact Details', 'Batch Assignment'];

  useEffect(() => {
    if (editIntern) {
      setFormData({
        ...editIntern,
        batch: editIntern.batch || { id: '' }
      });
    }
  }, [editIntern]);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const response = await batchAPI.getAll();
      setBatches(response.data);
    } catch (err) {
      console.error('Failed to load batches:', err);
      setError('Failed to load batches');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.name.trim() && formData.dateOfJoining;
      case 1:
        return formData.email.trim() && formData.mobileNumber.trim();
      case 2:
        return formData.batch.id && formData.idCardType;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      setError('Please fill all required fields before proceeding');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateStep(2)) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (editIntern) {
        result = await internAPI.update(editIntern.id, formData);
        setSuccess('Intern updated successfully!');
      } else {
        result = await internAPI.create(formData);
        setSuccess('Intern created successfully!');
        setShowSuccessDialog(true);
        resetForm();
      }
      
      if (onInternCreated) {
        onInternCreated(result?.data);
      }
    } catch (err) {
      console.error('Error saving intern:', err);
      setError(editIntern ? 'Failed to update intern' : 'Failed to create intern');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      idCardType: 'FREE',
      dateOfJoining: '',
      batch: { id: '' }
    });
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'batchId') {
      setFormData(prev => ({ ...prev, batch: { id: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    if (onClose) {
      onClose();
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form-step">
            <Typography variant="h6" className="step-title">
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-field"
              placeholder="Enter intern's full name"
            />
            <TextField
              fullWidth
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              className="form-field"
            />
          </div>
        );

      case 1:
        return (
          <div className="form-step">
            <Typography variant="h6" className="step-title">
              Contact Details
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-field"
              placeholder="intern@company.com"
            />
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="form-field"
              placeholder="+91 9876543210"
            />
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <Typography variant="h6" className="step-title">
              Batch & ID Card
            </Typography>
            <TextField
              fullWidth
              select
              label="Select Batch"
              name="batchId"
              value={formData.batch.id}
              onChange={handleChange}
              required
              className="form-field"
            >
              <MenuItem value="">Choose a batch</MenuItem>
              {batches.map(batch => (
                <MenuItem key={batch.id} value={batch.id}>
                  <div className="batch-option">
                    <span className="batch-date">Batch {batch.id}</span>
                    <span className="batch-dates">
                      {batch.startDate} to {batch.endDate}
                    </span>
                  </div>
                </MenuItem>
              ))}
            </TextField>
            
            <div className="card-type-section">
              <Typography variant="subtitle2" className="card-type-label">
                ID Card Type
              </Typography>
              <div className="card-type-options">
                <div 
                  className={`card-type-option ${formData.idCardType === 'FREE' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, idCardType: 'FREE' }))}
                >
                  <div className="card-type-header">
                    <Typography variant="h6" className="card-type-title">
                      Free
                    </Typography>
                    <Chip label="TDA" size="small" className="free-chip" />
                  </div>
                  <Typography variant="body2" className="card-type-desc">
                    Basic ID card with standard features
                  </Typography>
                </div>
                <div 
                  className={`card-type-option ${formData.idCardType === 'PREMIUM' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, idCardType: 'PREMIUM' }))}
                >
                  <div className="card-type-header">
                    <Typography variant="h6" className="card-type-title">
                      Premium
                    </Typography>
                    <Chip label="EMP" size="small" className="premium-chip" />
                  </div>
                  <Typography variant="body2" className="card-type-desc">
                    Premium ID card with enhanced features
                  </Typography>
                </div>
              </div>
            </div>

            {formData.dateOfJoining && formData.idCardType && (
              <div className="id-preview">
                <Typography variant="subtitle2" className="preview-label">
                  Generated ID Preview:
                </Typography>
                <div className="id-preview-value">
                  {formData.idCardType === 'PREMIUM' ? 'EMP' : 'TDA'}
                  {formData.dateOfJoining.replace(/-/g, '')}-001
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepper = () => {
    if (isMobile) {
      return (
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          className="mobile-stepper"
          nextButton={null}
          backButton={null}
        />
      );
    }

    return (
      <Stepper activeStep={activeStep} className="desktop-stepper">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  return (
    <div className="intern-form-container">
      <Paper elevation={isMobile ? 0 : 3} className={`form-paper ${isMobile ? 'mobile' : ''}`}>
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            {editIntern ? <Edit className="header-icon" /> : <PersonAdd className="header-icon" />}
            <Typography variant="h5" className="form-title">
              {editIntern ? 'Edit Intern' : 'Add New Intern'}
            </Typography>
          </div>
          {onClose && (
            <IconButton onClick={onClose} className="close-button">
              <Close />
            </IconButton>
          )}
        </div>

        {/* Stepper */}
        {!editIntern && renderStepper()}

        {/* Error/Success Alerts */}
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

        {/* Form Content */}
        <Box component="form" onSubmit={handleSubmit} className="form-content">
          {renderStepContent(activeStep)}

          {/* Navigation Buttons */}
          <div className="form-actions">
            {!editIntern ? (
              <>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="back-button"
                  startIcon={<KeyboardArrowLeft />}
                >
                  Back
                </Button>
                
                <div className="step-actions">
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      className="submit-button"
                      startIcon={loading ? null : <CheckCircle />}
                    >
                      {loading ? 'Saving...' : (editIntern ? 'Update Intern' : 'Create Intern')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      className="next-button"
                      endIcon={<KeyboardArrowRight />}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="edit-actions">
                <Button
                  onClick={onClose}
                  className="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="submit-button"
                  startIcon={loading ? null : <CheckCircle />}
                >
                  {loading ? 'Updating...' : 'Update Intern'}
                </Button>
              </div>
            )}
          </div>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccess}
        className="success-dialog"
      >
        <DialogTitle className="success-dialog-title">
          <CheckCircle className="success-icon" />
          Intern Created Successfully!
        </DialogTitle>
        <DialogContent>
          <Typography>
            The intern has been successfully added to the system. 
            Their ID card will be generated automatically.
          </Typography>
          <div className="intern-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{formData.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{formData.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Batch:</span>
              <span className="detail-value">
                Batch {batches.find(b => b.id === formData.batch.id)?.id}
              </span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccess} className="dialog-button">
            Add Another Intern
          </Button>
          <Button 
            onClick={handleCloseSuccess} 
            variant="contained" 
            className="dialog-button primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InternForm;