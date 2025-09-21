# Backend API Documentation

## Overview
This backend provides APIs for managing AI models with caching functionality for improved performance.

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Models

#### GET /models
Retrieve all free AI models.

**Response:**
```json
{
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "description": "Fast and efficient model",
      "pricing": {
        "prompt": "0",
        "completion": "0"
      },
      "context_length": 4096
    }
  ]
}
```

#### GET /models/{id}
Retrieve a specific model by ID.

**Parameters:**
- `id` (string): Model ID

**Response:**
```json
{
  "data": {
    "id": "gpt-3.5-turbo",
    "name": "GPT-3.5 Turbo",
    "description": "Fast and efficient model",
    "pricing": {
      "prompt": "0",
      "completion": "0"
    }
  }
}
```

### Cache Management

#### POST /cache/invalidate
Invalidate cache entries.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "key": "models" // optional, specific key to invalidate
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cache invalidated successfully",
  "invalidated_keys": ["models"]
}
```

#### GET /cache/stats
Get cache performance statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_entries": 5,
  "total_size": 245760,
  "hit_ratio": 0.85,
  "entries": [
    {
      "key": "models",
      "hits": 150,
      "misses": 25,
      "last_accessed": "2025-09-21T03:30:00.000Z"
    }
  ]
}
```

## Caching

The API implements caching to improve performance:

- **Cache Duration**: 5 minutes
- **Cache Strategy**: Cache-aside pattern
- **Cache Storage**: In-memory using node-cache
- **Cache Keys**:
  - `models`: All models list
  - `model:{id}`: Individual model data

## Authentication

Cache management endpoints require Bearer token authentication. For development, any token is accepted.

## Error Responses

All endpoints return standard HTTP status codes:

- `200`: Success
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": {
    "message": "Error description",
    "type": "error_type"
  }
}
```

## Development

### Running Tests
```bash
npm test
```

### Starting Server
```bash
npm start
```

### Development Mode
```bash
npm run dev