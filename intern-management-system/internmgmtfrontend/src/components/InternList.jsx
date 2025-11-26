import React, { useState, useEffect } from 'react';
import { internAPI } from '../services/api';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Edit,
  Delete,
  FilterList,
  Search,
  Clear,
  ViewList
} from '@mui/icons-material';
import './InternList.css';

const InternList = ({ onEditIntern, refresh }) => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    batch: '',
    idCardType: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, intern: null });
  const [mobileFilters, setMobileFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadInterns();
  }, [refresh]);

  useEffect(() => {
    filterInterns();
  }, [interns, filters]);

  const loadInterns = async () => {
    try {
      const response = await internAPI.getAll();
      setInterns(response.data);
    } catch (err) {
      console.error('Failed to load interns');
    }
  };

  const filterInterns = () => {
    let filtered = interns;
    
    if (filters.name) {
      filtered = filtered.filter(intern => 
        intern.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.batch) {
      filtered = filtered.filter(intern => 
        intern.batch && intern.batch.id.toString() === filters.batch
      );
    }
    
    if (filters.idCardType) {
      filtered = filtered.filter(intern => 
        intern.idCardType === filters.idCardType
      );
    }
    
    setFilteredInterns(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await internAPI.delete(id);
      loadInterns();
      setDeleteDialog({ open: false, intern: null });
    } catch (err) {
      console.error('Failed to delete intern');
    }
  };

  const openDeleteDialog = (intern) => {
    setDeleteDialog({ open: true, intern });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, intern: null });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      batch: '',
      idCardType: ''
    });
  };

  const getBatchOptions = () => {
    const batchIds = [...new Set(interns
      .filter(intern => intern.batch)
      .map(intern => intern.batch.id)
    )];
    return batchIds;
  };

  const renderDesktopView = () => (
    <div className="intern-list-container">
      {/* Header */}
      <div className="list-header">
        <Typography variant="h5" className="list-title">
          Intern List
        </Typography>
        <Typography variant="body2" className="list-count">
          {filteredInterns.length} of {interns.length} interns
        </Typography>
      </div>

      {/* Filters - Desktop */}
      <Paper className="filters-container">
        <div className="filters-row">
          <TextField
            label="Search by Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            size="small"
            className="filter-field"
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <TextField
            select
            label="Filter by Batch"
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            size="small"
            className="filter-field"
          >
            <MenuItem value="">All Batches</MenuItem>
            {getBatchOptions().map(batchId => (
              <MenuItem key={batchId} value={batchId.toString()}>
                Batch {batchId}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="ID Card Type"
            value={filters.idCardType}
            onChange={(e) => handleFilterChange('idCardType', e.target.value)}
            size="small"
            className="filter-field"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="FREE">Free</MenuItem>
            <MenuItem value="PREMIUM">Premium</MenuItem>
          </TextField>
          
          <Button 
            onClick={clearFilters} 
            variant="outlined" 
            className="clear-filters-btn"
            startIcon={<Clear />}
          >
            Clear
          </Button>
        </div>
      </Paper>

      {/* Table - Desktop */}
      <Paper className="table-container">
        <div className="table-wrapper">
          <table className="intern-table">
            <thead>
              <tr>
                <th className="column-id">Intern ID</th>
                <th className="column-name">Name</th>
                <th className="column-email">Email</th>
                <th className="column-mobile">Mobile</th>
                <th className="column-batch">Batch</th>
                <th className="column-cardtype">ID Card</th>
                <th className="column-date">Join Date</th>
                <th className="column-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-content">
                      <ViewList fontSize="large" />
                      <Typography variant="body1">
                        {interns.length === 0 ? 'No interns found' : 'No interns match your filters'}
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInterns.map(intern => (
                  <tr key={intern.id} className="table-row">
                    <td className="column-id">
                      <span className="intern-id">{intern.internId}</span>
                    </td>
                    <td className="column-name">
                      <span className="intern-name">{intern.name}</span>
                    </td>
                    <td className="column-email">
                      <span className="intern-email">{intern.email}</span>
                    </td>
                    <td className="column-mobile">
                      <span className="intern-mobile">{intern.mobileNumber}</span>
                    </td>
                    <td className="column-batch">
                      <span className={`batch-badge ${!intern.batch ? 'no-batch' : ''}`}>
                        {intern.batch ? `Batch ${intern.batch.id}` : 'No Batch'}
                      </span>
                    </td>
                    <td className="column-cardtype">
                      <span className={`card-type ${intern.idCardType.toLowerCase()}`}>
                        {intern.idCardType}
                      </span>
                    </td>
                    <td className="column-date">
                      <span className="join-date">{intern.dateOfJoining}</span>
                    </td>
                    <td className="column-actions">
                      <div className="action-buttons">
                        <IconButton 
                          onClick={() => onEditIntern(intern)} 
                          className="edit-btn"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => openDeleteDialog(intern)} 
                          className="delete-btn"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );

  const renderMobileView = () => (
    <div className="intern-list-container mobile">
      {/* Header */}
      <div className="list-header mobile">
        <div className="mobile-header-top">
          <Typography variant="h6" className="list-title">
            Interns ({filteredInterns.length})
          </Typography>
          <IconButton 
            onClick={() => setMobileFilters(!mobileFilters)}
            className="filter-toggle"
          >
            <FilterList />
          </IconButton>
        </div>

        {/* Mobile Filters */}
        {mobileFilters && (
          <Paper className="mobile-filters">
            <TextField
              fullWidth
              label="Search by Name"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <TextField
              fullWidth
              select
              label="Filter by Batch"
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="">All Batches</MenuItem>
              {getBatchOptions().map(batchId => (
                <MenuItem key={batchId} value={batchId.toString()}>
                  Batch {batchId}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              select
              label="ID Card Type"
              value={filters.idCardType}
              onChange={(e) => handleFilterChange('idCardType', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="FREE">Free</MenuItem>
              <MenuItem value="PREMIUM">Premium</MenuItem>
            </TextField>
            
            <Button 
              onClick={clearFilters} 
              variant="outlined" 
              fullWidth
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
          </Paper>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {filteredInterns.length === 0 ? (
          <Paper className="no-data-card">
            <div className="no-data-content">
              <ViewList fontSize="large" />
              <Typography variant="body1" align="center">
                {interns.length === 0 ? 'No interns found' : 'No interns match your filters'}
              </Typography>
            </div>
          </Paper>
        ) : (
          filteredInterns.map(intern => (
            <Paper key={intern.id} className="intern-card">
              <div className="card-header">
                <div className="card-title">
                  <Typography variant="subtitle1" className="intern-name">
                    {intern.name}
                  </Typography>
                  <span className={`card-type ${intern.idCardType.toLowerCase()}`}>
                    {intern.idCardType}
                  </span>
                </div>
                <div className="card-actions">
                  <IconButton 
                    onClick={() => onEditIntern(intern)} 
                    className="edit-btn"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => openDeleteDialog(intern)} 
                    className="delete-btn"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-row">
                  <span className="label">ID:</span>
                  <span className="value intern-id">{intern.internId}</span>
                </div>
                <div className="card-row">
                  <span className="label">Email:</span>
                  <span className="value intern-email">{intern.email}</span>
                </div>
                <div className="card-row">
                  <span className="label">Mobile:</span>
                  <span className="value intern-mobile">{intern.mobileNumber}</span>
                </div>
                <div className="card-row">
                  <span className="label">Batch:</span>
                  <span className="value batch-badge">
                    {intern.batch ? `Batch ${intern.batch.id}` : 'No Batch'}
                  </span>
                </div>
                <div className="card-row">
                  <span className="label">Join Date:</span>
                  <span className="value join-date">{intern.dateOfJoining}</span>
                </div>
              </div>
            </Paper>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        className="delete-dialog"
      >
        <DialogTitle>Delete Intern</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete intern "{deleteDialog.intern?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} className="cancel-btn">
            Cancel
          </Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.intern?.id)} 
            className="confirm-delete-btn"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InternList;