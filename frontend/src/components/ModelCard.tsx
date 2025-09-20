import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    description: string;
    provider: string;
    pricing: {
      prompt: number;
      completion: number;
    };
    context_length: number;
    created?: string | number;
  };
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
            {model.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {model.description}
        </Typography>

        <Box display="flex" flexDirection="column" gap={0.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {model.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {model.context_length.toLocaleString()} tokens
            </Typography>
          </Box>
          {model.created && (
            <Typography variant="caption" color="text.secondary">
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