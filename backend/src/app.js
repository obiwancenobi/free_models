const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Services
const databaseService = require('./services/databaseService');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS,            // Only allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
  credentials: true                                  // Allow cookies or other credentials
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Routes
const modelsRouter = require('./routes/models');
const cacheRouter = require('./routes/cache');
const healthRouter = require('./routes/health');
app.use('/api/models', modelsRouter);
app.use('/api/cache', cacheRouter);
app.use('/health', healthRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      type: 'internal_error'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      type: 'not_found'
    }
  });
});

async function startServer() {
  try {
    // Initialize database connection
    await databaseService.connect();
    console.log('Database system initialized');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Cache system initialized and ready');
      console.log('PostgreSQL integration active');
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;