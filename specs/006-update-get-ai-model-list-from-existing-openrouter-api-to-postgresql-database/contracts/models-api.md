# Models API Contract

## Overview
API contract for AI model endpoints with PostgreSQL database integration and cache-first performance optimization.

## Base URL
```
/api/models
```

## Authentication
No authentication required for public model listings.

## Endpoints

### GET /api/models

**Description**: Retrieve all available free AI models with cache-first, database-fallback data retrieval.

**Cache Strategy**:
- Primary: In-memory cache (fastest response)
- Secondary: PostgreSQL database (persistent storage)
- Fallback: OpenRouter API (fresh data source)

**Response Schema**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "context_length": "number",
      "created": "string (ISO date or timestamp)"
    }
  ]
}
```

**Status Codes**:
- `200`: Success - Returns array of model objects
- `500`: Internal Server Error - Database or API failure

**Performance Expectations**:
- Cache hit: <50ms response time
- Database hit: <200ms response time
- API fallback: <2000ms response time

**Example Request**:
```bash
curl -X GET "https://api.example.com/api/models" \
  -H "Accept: application/json"
```

**Example Response**:
```json
{
  "data": [
    {
      "id": "meta-llama/llama-3.1-8b-instruct",
      "name": "Meta Llama 3.1 8B Instruct",
      "description": "Meta's latest Llama model optimized for instruction following",
      "context_length": 8192,
      "created": "2024-07-23T00:00:00.000Z"
    }
  ]
}
```

### GET /api/models/{id}

**Description**: Retrieve a specific AI model by ID with same cache-first strategy.

**Path Parameters**:
- `id` (string, required): The model identifier

**Response Schema**:
```json
{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "context_length": "number",
    "created": "string (ISO date or timestamp)"
  }
}
```

**Status Codes**:
- `200`: Success - Returns model object
- `404`: Not Found - Model with specified ID not found
- `500`: Internal Server Error - Database or API failure

**Example Request**:
```bash
curl -X GET "https://api.example.com/api/models/meta-llama/llama-3.1-8b-instruct" \
  -H "Accept: application/json"
```

## Data Flow

### Retrieval Priority
1. **In-Memory Cache** (Primary)
   - Fastest response time
   - Existing TTL mechanism maintained
   - Immediate response for repeated requests

2. **PostgreSQL Database** (Secondary)
   - Persistent storage across restarts
   - Data survives cache expiration
   - Automatic cache refresh on database hit

3. **OpenRouter API** (Fallback)
   - Fresh data source
   - Automatic database and cache update
   - Ensures data availability

### Error Handling
- Database connectivity issues → Graceful fallback to cache
- Cache miss + Database miss → API call with data storage
- All failures logged for monitoring and debugging

## Schema Validation

### Model Object Properties
- `id`: String, required, unique identifier
- `name`: String, required, human-readable name
- `description`: String, optional, model description
- `context_length`: Number, optional, maximum context tokens
- `created`: String/Number, optional, creation timestamp

### Response Format
- All responses wrapped in `{data: ...}` object
- Array responses for listings, object responses for single items
- Consistent error format across all endpoints

## Performance Characteristics

### Response Times
- **Cache Hit**: <50ms
- **Database Hit**: <200ms
- **API Fallback**: <2000ms

### Availability
- **Cache + Database**: 99.9%+ availability
- **API Dependency**: External service reliability dependent
- **Graceful Degradation**: Service continues with reduced performance if API unavailable

## Testing Requirements

### Contract Tests
- Response schema validation
- Status code verification
- Performance benchmark validation
- Error response format checking

### Integration Tests
- Cache-first behavior verification
- Database fallback testing
- API fallback scenario testing
- Error handling validation