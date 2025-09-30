# Database Schema Design for AI Models

## Overview
This document defines the PostgreSQL database schema for storing AI model data from OpenRouter API, enabling data persistence while maintaining the existing cache-based performance optimization.

**Database Configuration**: External PostgreSQL database connection via URL (no local Docker service required).

## Schema Design

### Table: `ai_models`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(255) | PRIMARY KEY | Unique model identifier from OpenRouter |
| `name` | TEXT | NOT NULL | Human-readable model name |
| `description` | TEXT | | Model description and capabilities |
| `context_length` | INTEGER | | Maximum context length in tokens |
| `created` | TIMESTAMPTZ | | Model creation timestamp from OpenRouter |

### Indexes

```sql
-- Primary index on model ID for fast lookups
CREATE UNIQUE INDEX idx_ai_models_id ON ai_models(id);

-- Index on context length for sorting capabilities
CREATE INDEX idx_ai_models_context_length ON ai_models(context_length);

-- Index on creation time for sorting capabilities
CREATE INDEX idx_ai_models_created ON ai_models(created);

-- Composite index for common query patterns
CREATE INDEX idx_ai_models_context_created ON ai_models(context_length, created);
```

## Data Flow Architecture

```
OpenRouter API
       ↓
[Fetch Models] → [Filter Free Models] → [Store in Database] → [Update Cache]
       ↑                    ↓                    ↓              ↓
       └───[API Fallback] ←──┘          [Database] ←──┘              ↑
              ↑                           ↑                         ↓
              └───[Cache] ←───────────────┘                    [Performance]
```

### Data Retrieval Priority:
1. **Cache First**: Use in-memory cache for fastest response (existing behavior)
2. **Database Second**: Check PostgreSQL for persistence when cache misses
3. **API Third**: Fetch fresh data from OpenRouter when both cache and database miss


## Database Connection Configuration

### Environment Variables Required:
- `DATABASE_URL`: PostgreSQL connection URL (e.g., `postgresql://user:password@host:port/database`)
- `DB_SSL`: SSL mode setting (`require`, `prefer`, `disable`)
- `DB_MAX_CONNECTIONS`: Maximum connection pool size (default: 10)

### Connection String Format:
```
postgresql://[user[:password]@][host][:port][/database][?sslmode=require]
```

## Migration Strategy

The migration will:
1. Create the `ai_models` table with essential columns (id, name, description, context_length, created)
2. Add appropriate indexes for performance
3. Include sample data insertion for testing
4. Provide rollback capability
5. Run against external PostgreSQL database via connection URL

### Handling Existing Tables

**Table Existence Check:**
- Migration script will check if `ai_models` table already exists
- If table exists: Skip creation and log warning
- If table doesn't exist: Create table with specified schema

**Schema Compatibility:**
- Existing tables are assumed to be compatible with target schema
- No automatic schema alterations will be performed
- Manual intervention required if schema conflicts exist

**Data Preservation:**
- Existing data in `ai_models` table will be preserved
- New data will be inserted alongside existing records
- No data migration or transformation will occur

## Simplified Data Storage

Only essential model information is stored:
- **id**: OpenRouter model identifier
- **name**: Human-readable model name
- **description**: Model description and capabilities
- **context_length**: Token limit for model
- **created**: Model creation timestamp

Additional model metadata (provider, pricing, features) will continue to be fetched fresh from the OpenRouter API when needed, ensuring data consistency and reducing storage overhead.

## Performance Considerations

- **Read Performance**: Primary lookups by ID will be O(1) with the primary key index
- **Write Performance**: JSONB fields allow flexible schema evolution without migrations
- **Storage**: JSONB compression reduces storage overhead for metadata fields
- **Cache Integration**: Database serves as the source of truth, cache provides speed

## Backup and Recovery

- Models data is ephemeral (refreshed from API), so point-in-time recovery is not critical
- Database schema changes will be versioned and migratable
- Connection pooling will be used for optimal database performance