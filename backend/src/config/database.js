/**
 * Database configuration module
 * Handles database connection settings and validation
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class DatabaseConfig {
  constructor() {
    this.validateEnvironment();
  }

  /**
   * Validate required environment variables
   */
  validateEnvironment() {
    const required = ['DATABASE_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Get database connection configuration
   */
  getConnectionConfig() {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: this.getSslConfig(),
      max: this.getMaxConnections(),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      // Additional connection options
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
    };
  }

  /**
   * Get SSL configuration based on environment
   */
  getSslConfig() {
    const sslMode = process.env.DB_SSL || 'prefer';

    switch (sslMode) {
      case 'require':
        return { rejectUnauthorized: false };
      case 'prefer':
        return true;
      case 'disable':
        return false;
      default:
        return { rejectUnauthorized: false };
    }
  }

  /**
   * Get maximum connection pool size
   */
  getMaxConnections() {
    const max = parseInt(process.env.DB_MAX_CONNECTIONS) || 10;

    // Reasonable bounds for connection pool
    return Math.max(1, Math.min(max, 50));
  }

  /**
   * Get database health check query
   */
  getHealthCheckQuery() {
    return 'SELECT 1 as health_check';
  }

  /**
   * Get query timeout in milliseconds
   */
  getQueryTimeout() {
    return parseInt(process.env.DB_QUERY_TIMEOUT) || 10000;
  }

  /**
   * Check if database is enabled in current environment
   */
  isDatabaseEnabled() {
    return process.env.DATABASE_URL && process.env.DATABASE_URL !== 'disabled';
  }

  /**
   * Get database connection info for logging (without credentials)
   */
  getConnectionInfo() {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: url.port,
        database: url.pathname.slice(1), // Remove leading slash
        ssl: this.getSslConfig(),
        maxConnections: this.getMaxConnections(),
      };
    } catch (error) {
      return { error: 'Invalid DATABASE_URL format' };
    }
  }
}

// Export singleton instance
module.exports = new DatabaseConfig();