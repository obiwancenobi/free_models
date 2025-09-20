import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import SearchBar from './components/SearchBar';
import ModelList from './components/ModelList';
import ModelDetails from './components/ModelDetails';
import { apiService, Model } from './services/apiService';

const theme = createTheme({
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Free AI Models Explorer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Discover Free AI Models
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Explore and compare free AI models available through OpenRouter
          </Typography>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <ModelList
            models={models}
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
    </ThemeProvider>
  );
}

export default App;
