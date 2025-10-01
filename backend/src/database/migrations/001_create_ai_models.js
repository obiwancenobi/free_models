/**
 * Migration: Create ai_models table
 *
 * This migration safely creates the ai_models table if it doesn't exist,
 * preventing conflicts with existing databases.
 */

const databaseService = require('../../services/databaseService');

async function up() {
  try {
    console.log('Running migration: Create ai_models table');

    // Check if table exists first (safe for existing databases)
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'ai_models'
      );
    `;

    const result = await databaseService.pool.query(checkQuery);
    const tableExists = result.rows[0].exists;

    if (tableExists) {
      console.log('ai_models table already exists, skipping creation');
      return;
    }

    // Create the table
    const createQuery = `
      CREATE TABLE ai_models (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        context_length INTEGER,
        created TIMESTAMPTZ,
        data_fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await databaseService.pool.query(createQuery);
    console.log('Created ai_models table');

    // Create indexes for performance
    const indexQueries = [
      'CREATE INDEX idx_ai_models_context_length ON ai_models(context_length);',
      'CREATE INDEX idx_ai_models_created ON ai_models(created);',
      'CREATE INDEX idx_ai_models_fetched_at ON ai_models(data_fetched_at);',
      'CREATE INDEX idx_ai_models_context_created ON ai_models(context_length, created);'
    ];

    for (const indexQuery of indexQueries) {
      await databaseService.pool.query(indexQuery);
    }

    console.log('Created indexes for ai_models table');

    // Update the data_fetched_at for any existing records (if table was recreated)
    await databaseService.pool.query(`
      UPDATE ai_models
      SET data_fetched_at = NOW()
      WHERE data_fetched_at IS NULL
    `);

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  }
}

async function down() {
  try {
    console.log('Rolling back migration: Drop ai_models table');

    // Note: This is destructive and will lose data
    // Only run in development/testing environments
    const dropQuery = 'DROP TABLE IF EXISTS ai_models CASCADE;';
    await databaseService.pool.query(dropQuery);

    console.log('Dropped ai_models table');

  } catch (error) {
    console.error('Rollback failed:', error.message);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  const command = process.argv[2];

  databaseService.connect()
    .then(() => {
      if (command === 'down') {
        return down();
      } else {
        return up();
      }
    })
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      return databaseService.disconnect();
    });
}

module.exports = { up, down };