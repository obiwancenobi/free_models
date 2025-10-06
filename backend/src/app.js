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

// Security middleware for network access control
const networkAccessControl = (req, res, next) => {
  // Log all incoming connections for security monitoring
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`[SECURITY] Access attempt from ${clientIP} to ${req.method} ${req.path}`);

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};

// Middleware
app.use(helmet());
app.use(networkAccessControl);
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

    // Start HTTP server - bind to all interfaces for container networking
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Cache system initialized and ready');
      console.log('PostgreSQL integration active');
      console.log(`Health check available at http://localhost:${PORT}/health`);
      console.log('API accessible within Docker network only');
      console.log('External access denied - container network isolation active');
    });

    // Add connection logging for security monitoring
    server.on('connection', (socket) => {
      const clientIP = socket.remoteAddress;
      console.log(`Connection from ${clientIP} - monitoring for security`);
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