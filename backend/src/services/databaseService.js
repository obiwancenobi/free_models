const { Pool } = require('pg');
const databaseConfig = require('../config/database');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Initialize database connection pool
   */
  async connect() {
    try {
      if (this.pool) {
        return; // Already connected
      }

      // Check if database is enabled
      if (!databaseConfig.isDatabaseEnabled()) {
        throw new Error('Database is disabled in current environment');
      }

      const connectionConfig = databaseConfig.getConnectionConfig();
      this.pool = new Pool(connectionConfig);

      // Test the connection
      await this.pool.query('SELECT 1');
      this.isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      this.isConnected = false;
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Close database connection pool
   */
  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('Database disconnected');
    }
  }

  /**
   * Check database connectivity
   */
  async healthCheck() {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const result = await this.pool.query('SELECT 1');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connectionCount: this.pool.totalCount
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get all AI models from database
   */
  async getAllModels() {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const query = `
        SELECT id, name, description, context_length, created
        FROM ai_models
        ORDER BY created DESC
      `;

      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching models from database:', error.message);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * Get a specific model by ID
   */
  async getModelById(id) {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const query = `
        SELECT id, name, description, context_length, created
        FROM ai_models
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching model ${id} from database:`, error.message);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * Store models in database (upsert pattern)
   */
  async storeModels(models) {
    try {
      if (!this.pool) {
        await this.connect();
      }

      // Use transaction for atomicity
      const client = await this.pool.connect();

      try {
        await client.query('BEGIN');

        for (const model of models) {
          const query = `
            INSERT INTO ai_models (id, name, description, context_length, created)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id)
            DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              context_length = EXCLUDED.context_length,
              created = EXCLUDED.created
          `;

          await client.query(query, [
            model.id,
            model.name,
            model.description || null,
            model.context_length || null,
            model.created ? new Date(model.created) : null
          ]);
        }

        await client.query('COMMIT');
        console.log(`Stored ${models.length} models in database`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error storing models in database:', error.message);
      throw new Error(`Database store failed: ${error.message}`);
    }
  }

  /**
   * Clear all models from database
   */
  async clearModels() {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const query = 'DELETE FROM ai_models';
      await this.pool.query(query);
      console.log('Cleared all models from database');
    } catch (error) {
      console.error('Error clearing models from database:', error.message);
      throw new Error(`Database clear failed: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const query = `
        SELECT
          COUNT(*) as total_models,
          MIN(created) as oldest_model,
          MAX(created) as newest_model
        FROM ai_models
      `;

      const result = await this.pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching database stats:', error.message);
      throw new Error(`Database stats failed: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new DatabaseService();