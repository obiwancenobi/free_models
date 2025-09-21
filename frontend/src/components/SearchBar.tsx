import React, { useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { trackEvent } from '../utils/analytics';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSortByDate?: () => void;
  onSortByContext?: () => void;
  isSortingByDate?: boolean;
  isSortingByContext?: boolean;
  isAscending?: boolean;
  isDescending?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search AI models...",
  onSortByDate,
  onSortByContext,
  isSortingByDate = false,
  isSortingByContext = false,
  isAscending = false,
  isDescending = false
}) => {
  const prevSearchRef = useRef<string>('');

  useEffect(() => {
    if (value && value !== prevSearchRef.current && value.trim().length > 0) {
      trackEvent('search', { search_term: value.trim() });
    }
    prevSearchRef.current = value;
  }, [value]);

  const handleClear = () => {
    onChange('');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--theme-text-secondary)' }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{ color: 'var(--theme-text-secondary)' }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'var(--theme-background)',
              color: 'var(--theme-text-primary)',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--theme-primary)',
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--theme-primary)',
                  borderWidth: 2,
                },
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--theme-border)',
            },
            '& .MuiInputLabel-root': {
              color: 'var(--theme-text-secondary)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'var(--theme-primary)',
            },
          }}
        />

        {/* Sort Buttons */}
        {onSortByDate && (
          <IconButton
            onClick={onSortByDate}
            size="medium"
            sx={{
              color: isSortingByDate ? 'var(--theme-primary)' : 'var(--theme-text-secondary)',
              backgroundColor: isSortingByDate ? 'var(--theme-focus)' : 'transparent',
              '&:hover': {
                backgroundColor: 'var(--theme-hover)',
              },
              px: 2,
              borderRadius: 1,
              transition: 'all 0.2s ease',
            }}
            aria-label="Sort by date"
          >
            <SortIcon sx={{ mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                fontWeight: isSortingByDate ? 600 : 400,
                textTransform: 'none',
                color: 'var(--theme-text-primary)'
              }}
            >
              Date
            </Typography>
            {isSortingByDate && (
              isAscending ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
            )}
          </IconButton>
        )}

        {onSortByContext && (
          <IconButton
            onClick={onSortByContext}
            size="medium"
            sx={{
              color: isSortingByContext ? 'var(--theme-primary)' : 'var(--theme-text-secondary)',
              backgroundColor: isSortingByContext ? 'var(--theme-focus)' : 'transparent',
              '&:hover': {
                backgroundColor: 'var(--theme-hover)',
              },
              px: 2,
              borderRadius: 1,
              transition: 'all 0.2s ease',
            }}
            aria-label="Sort by context length"
          >
            <SortIcon sx={{ mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                fontWeight: isSortingByContext ? 600 : 400,
                textTransform: 'none',
                color: 'var(--theme-text-primary)'
              }}
            >
              Context
            </Typography>
            {isSortingByContext && (
              isAscending ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
            )}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;