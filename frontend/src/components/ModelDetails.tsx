import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Model } from '../services/apiService';

interface ModelDetailsProps {
  model: Model | null;
  open: boolean;
  onClose: () => void;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ model, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!model) return null;

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 400,
          maxWidth: '100%',
          p: 3,
          backgroundColor: 'var(--theme-background)',
          color: 'var(--theme-text-primary)',
        },
      }}
    >
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              flexGrow: 1,
              mr: 2,
              color: 'var(--theme-text-primary)'
            }}
          >
            {model.name}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'var(--theme-text-primary)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Provider and Pricing */}
        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={model.id}
            variant="outlined"
            size="small"
            sx={{
              color: 'var(--theme-text-primary)',
              borderColor: 'var(--theme-border)',
              '&:hover': {
                backgroundColor: 'var(--theme-hover)',
                borderColor: 'var(--theme-primary)',
              }
            }}
          />
        </Box>

        <Divider
          sx={{
            mb: 2,
            borderColor: 'var(--theme-border)'
          }}
        />

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: 'var(--theme-text-primary)'
          }}
        >
          {model.description}
        </Typography>

        {/* Technical Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'var(--theme-text-primary)'
            }}
          >
            Technical Details
          </Typography>

          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-secondary)' }}
              >
                Context Length:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-primary)' }}
              >
                {model.context_length.toLocaleString()} tokens
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-secondary)' }}
              >
                Prompt Pricing:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-primary)' }}
              >
                {model.pricing.prompt === 0 ? 'Free' : `$${model.pricing.prompt}/token`}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-secondary)' }}
              >
                Completion Pricing:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--theme-text-primary)' }}
              >
                {model.pricing.completion === 0 ? 'Free' : `$${model.pricing.completion}/token`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Supported Features */}
        {model.supported_features && model.supported_features.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'var(--theme-text-primary)'
              }}
            >
              Supported Features
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {model.supported_features.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'var(--theme-text-primary)',
                    borderColor: 'var(--theme-border)',
                    '&:hover': {
                      backgroundColor: 'var(--theme-hover)',
                      borderColor: 'var(--theme-primary)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ModelDetails;