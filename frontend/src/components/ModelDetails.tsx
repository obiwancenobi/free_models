import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Model } from '../services/apiService';

interface ModelDetailsProps {
  model: Model | null;
  open: boolean;
  onClose: () => void;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ model, open, onClose }) => {

  // Function to parse URLs and Markdown-style links and render them as clickable links
  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return text;

    const elements: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    // First, handle Markdown-style links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      // Add the link
      const linkText = match[1];
      const linkUrl = match[2];
      elements.push(
        <Link
          key={`markdown-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'var(--theme-primary)',
            textDecoration: 'underline',
            '&:hover': {
              color: 'var(--theme-primary)',
              textDecoration: 'underline',
            }
          }}
        >
          {linkText}
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last markdown link
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);

      // Then handle plain URLs in the remaining text
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlParts = remainingText.split(urlRegex);

      urlParts.forEach((part, index) => {
        if (urlRegex.test(part)) {
          elements.push(
            <Link
              key={`url-${lastIndex + index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'var(--theme-primary)',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'var(--theme-primary)',
                  textDecoration: 'underline',
                }
              }}
            >
              {part}
            </Link>
          );
        } else {
          elements.push(part);
        }
      });
    }

    return elements.length > 0 ? elements : text;
  };

  if (!model) return null;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '100%',
          maxHeight: '80vh',
          p: 3,
          backgroundColor: 'var(--theme-background)',
          color: 'var(--theme-text-primary)',
          borderRadius: '12px 12px 0 0',
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
          {renderDescriptionWithLinks(model.description)}
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