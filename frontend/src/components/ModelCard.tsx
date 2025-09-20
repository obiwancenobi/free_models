import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
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
  };
  onClick: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick }) => {
  const theme = useTheme();

  const isFree = model.pricing.prompt === 0 && model.pricing.completion === 0;

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
          <Chip
            label={isFree ? 'Free' : 'Paid'}
            color={isFree ? 'success' : 'primary'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {model.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            By {model.provider}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {model.context_length.toLocaleString()} tokens
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModelCard;