import React from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import ModelCard from './ModelCard';
import { Model } from '../services/apiService';

interface ModelListProps {
  models: Model[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onModelClick: (model: Model) => void;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  loading,
  error,
  searchTerm,
  onModelClick
}) => {

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: 'var(--theme-primary)' }} />
        <Typography variant="body1" sx={{ ml: 2, color: 'var(--theme-text-primary)' }}>
          Loading models...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (models.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" sx={{ color: 'var(--theme-text-secondary)' }}>
          No models available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 2, color: 'var(--theme-text-secondary)' }}>
        Showing {models.length} models
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {models.map((model: Model) => (
          <ModelCard
            key={model.id}
            model={model}
            onClick={() => onModelClick(model)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ModelList;