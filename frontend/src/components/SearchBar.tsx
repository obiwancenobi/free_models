import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
  const theme = useTheme();

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
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{ color: theme.palette.action.active }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
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