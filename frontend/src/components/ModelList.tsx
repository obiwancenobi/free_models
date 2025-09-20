import React, { useMemo } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Fuse from 'fuse.js';
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

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(models, {
      keys: ['name', 'description', 'provider'],
      threshold: 0.3,
      includeScore: true
    });
  }, [models]);

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) {
      return models;
    }

    const results = fuse.search(searchTerm);
    return results.map(result => result.item);
  }, [models, searchTerm, fuse]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
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

  if (filteredModels.length === 0 && models.length > 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No models found matching "{searchTerm}"
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search terms
        </Typography>
      </Box>
    );
  }

  if (models.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No models available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please check your connection and try again
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredModels.length} of {models.length} models
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {filteredModels.map((model) => (
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