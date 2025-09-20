import React, { useState, useEffect } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import ThemeProvider from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import ModelList from './components/ModelList';
import ModelDetails from './components/ModelDetails';
import { apiService, Model } from './services/apiService';
import { useSorting } from './hooks/useSorting';
import './styles/theme.css';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Use sorting hook
  const {
    sortedModels: sortedFilteredModels,
    sortByDate,
    sortByContextLength,
    isSortingByDate,
    isSortingByContext,
    isAscending,
    isDescending
  } = useSorting(models, searchTerm);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await apiService.fetchModels();
      setModels(fetchedModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleModelClick = (model: Model) => {
    setSelectedModel(model);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedModel(null);
  };

  return (
    <ThemeProvider>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ThemeToggle />
        <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'var(--theme-background)' }}>
          <AppBar
            position="static"
            elevation={1}
            sx={{
              backgroundColor: 'var(--theme-background)',
              color: 'var(--theme-foreground)',
              borderBottom: '1px solid var(--theme-border)'
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  color: 'var(--theme-text-primary)'
                }}
              >
                Free AI Models Explorer
              </Typography>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                color: 'var(--theme-text-primary)',
                fontWeight: 600
              }}
            >
              Discover Free AI Models
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 4,
                color: 'var(--theme-text-secondary)'
              }}
            >
              Explore free AI models available through OpenRouter
            </Typography>

            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSortByDate={sortByDate}
              onSortByContext={sortByContextLength}
              isSortingByDate={isSortingByDate}
              isSortingByContext={isSortingByContext}
              isAscending={isAscending}
              isDescending={isDescending}
            />

            <ModelList
              models={sortedFilteredModels}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              onModelClick={handleModelClick}
            />
          </Container>

          <ModelDetails
            model={selectedModel}
            open={detailsOpen}
            onClose={handleCloseDetails}
          />
        </Box>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
