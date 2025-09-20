import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { Model } from '../services/apiService';

interface ModelCardProps {
  model: Model;
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: 'var(--theme-background)',
        border: '1px solid var(--theme-border)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--theme-shadow)',
          borderColor: 'var(--theme-primary)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              flexGrow: 1,
              mr: 1,
              color: 'var(--theme-text-primary)'
            }}
          >
            {model.name}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={0.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{ color: 'var(--theme-text-secondary)' }}
            >
              {model.id}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'var(--theme-text-secondary)' }}
            >
              {model.context_length.toLocaleString()} tokens
            </Typography>
          </Box>
          {model.created && (
            <Typography
              variant="caption"
              sx={{ color: 'var(--theme-text-secondary)' }}
            >
              Created: {new Date(
                typeof model.created === 'number' ? model.created * 1000 : model.created
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModelCard;