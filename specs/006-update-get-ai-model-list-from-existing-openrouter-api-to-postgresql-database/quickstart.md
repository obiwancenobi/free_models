# Quickstart: PostgreSQL Integration Testing

## Overview
Step-by-step validation guide for the PostgreSQL database integration with cache-first AI model storage.

## Prerequisites
- Node.js/Express backend running
- External PostgreSQL database accessible
- OpenRouter API key configured
- Database connection URL available

## Environment Setup

### Required Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"
DB_SSL="require"  # or "prefer" or "disable"
DB_MAX_CONNECTIONS="10"

# Existing Variables (unchanged)
OPENROUTER_API_KEY="your-api-key"
NODE_ENV="development"
```

### Database Schema Setup
Execute the migration script to create the `ai_models` table:
```sql
-- Migration script (run once)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_models') THEN
      CREATE TABLE ai_models (
         id VARCHAR(255) PRIMARY KEY,
         name TEXT NOT NULL,
         description TEXT,
         context_length INTEGER,
         created TIMESTAMPTZ
      );

      -- Create indexes for performance
      CREATE INDEX idx_ai_models_context_length ON ai_models(context_length);
      CREATE INDEX idx_ai_models_created ON ai_models(created);
   END IF;
END $$;
```

## Testing Scenarios

### Scenario 1: First-Time Application Start
**Objective**: Verify fresh data loading and storage

**Steps**:
1. **Clear cache and database** (if testing from scratch)
2. **Start the application**
3. **Make request to `/api/models`**
4. **Verify response** contains model data
5. **Check database** - models should be stored
6. **Check cache** - data should be cached

**Expected Results**:
- ✅ API returns 200 with model array
- ✅ Database contains inserted records
- ✅ Cache contains model data
- ✅ Response time < 2000ms (API fallback)

### Scenario 2: Cache Hit Performance
**Objective**: Verify fast cache responses

**Steps**:
1. **Ensure cache contains model data** (from previous scenario)
2. **Make request to `/api/models`**
3. **Measure response time**

**Expected Results**:
- ✅ Response time < 50ms
- ✅ Data served from cache (check logs)
- ✅ No database queries executed

### Scenario 3: Database Fallback
**Objective**: Verify database serves when cache misses

**Steps**:
1. **Clear/invalidate cache** (don't clear database)
2. **Make request to `/api/models`**
3. **Verify response** contains expected data

**Expected Results**:
- ✅ API returns 200 with model data
- ✅ Data served from database (check logs)
- ✅ Cache refreshed with database data
- ✅ Response time < 200ms

### Scenario 4: API Fallback
**Objective**: Verify API serves when both cache and database unavailable

**Steps**:
1. **Clear cache and disconnect database**
2. **Make request to `/api/models`**
3. **Verify response** contains fresh data

**Expected Results**:
- ✅ API returns 200 with model data
- ✅ Fresh data fetched from OpenRouter API
- ✅ Database updated with new data
- ✅ Cache refreshed with API data

### Scenario 5: Error Handling
**Objective**: Verify graceful degradation

**Steps**:
1. **Disconnect database**
2. **Make request to `/api/models`**
3. **Verify response** still works via cache

**Expected Results**:
- ✅ API returns 200 (served from cache)
- ✅ Error logged for database connectivity
- ✅ Application continues functioning

## Manual Testing Commands

### API Testing
```bash
# Test models endpoint
curl -w "\nResponse time: %{time_total}s\n" \
  http://localhost:3001/api/models

# Test specific model
curl http://localhost:3001/api/models/meta-llama/llama-3.1-8b-instruct

# Check database connectivity (if health endpoint added)
curl http://localhost:3001/health/database
```

### Database Verification
```sql
-- Check if models exist in database
SELECT COUNT(*) as model_count FROM ai_models;

-- View sample records
SELECT id, name, context_length, created
FROM ai_models
LIMIT 5;

-- Check table structure
\d ai_models
```

### Cache Verification
```javascript
// In Node.js console or debugger
const cacheService = require('./backend/src/services/cacheService');

// Check if models are cached
const cachedModels = cacheService.get('models');
console.log('Cached models:', cachedModels ? cachedModels.data.length : 'none');

// Check cache statistics
console.log('Cache stats:', cacheService.getStats());
```

## Performance Benchmarks

### Response Time Targets
- **Cache Hit**: < 50ms
- **Database Hit**: < 200ms
- **API Fallback**: < 2000ms

### Throughput Targets
- **Cache/Database Mode**: Maintain existing throughput
- **API Fallback Mode**: Graceful degradation acceptable

## Monitoring Points

### Application Logs
Watch for these log patterns:
```
# Cache hits
"Serving models from cache"

# Database hits
"Serving models from database"

# API fallbacks
"Fetching models from OpenRouter API"

# Errors
"Database query failed:" - Database issues
"Error fetching models from OpenRouter:" - API issues
```

### Database Metrics
- Connection pool usage
- Query performance
- Storage growth over time

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify DATABASE_URL format and credentials
- Check network connectivity to database
- Confirm SSL settings match database requirements

**Cache Not Working**
- Check cache service initialization
- Verify TTL settings
- Monitor memory usage

**API Rate Limiting**
- Monitor OpenRouter API usage
- Check API key validity
- Implement request throttling if needed

**Performance Issues**
- Monitor database query performance
- Check index usage
- Verify connection pool settings

## Success Criteria

### Functional Requirements
- [ ] Models stored in database on API fetch
- [ ] Cache-first retrieval working correctly
- [ ] Database fallback functioning
- [ ] API fallback operational
- [ ] Error handling graceful

### Performance Requirements
- [ ] Cache hits < 50ms
- [ ] Database hits < 200ms
- [ ] API fallback < 2000ms
- [ ] No performance regression from baseline

### Data Consistency
- [ ] Database and cache contain same data
- [ ] Fresh data fetched when needed
- [ ] No data loss on application restart

## Cleanup

### Reset for Re-testing
```sql
-- Clear database (if testing)
DELETE FROM ai_models;

-- Clear cache (restart application or clear programmatically)
```

### Remove Test Data
```sql
-- Drop table (for clean uninstall)
DROP TABLE IF EXISTS ai_models;
```

## Next Steps

After successful testing:
1. **Monitor production performance** for 1-2 weeks
2. **Set up database performance alerts**
3. **Document any issues encountered**
4. **Plan for database maintenance tasks**

---

**Testing Status**: Ready for execution once implementation complete