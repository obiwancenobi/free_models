# API Contracts

This directory contains API specifications for the PostgreSQL integration feature.

## Available Contracts

### Models API Contract
- **File**: `models-api.md`
- **Purpose**: Defines the existing `/api/models` endpoints with database integration
- **Status**: Maintains existing API contract while adding database persistence

## Contract Testing

Each contract includes:
- Request/response schemas
- Error response formats
- Authentication requirements
- Performance expectations

## Integration Notes

- Existing API endpoints remain unchanged from user perspective
- Database integration is transparent to API consumers
- Cache-first approach maintains existing performance characteristics
- Database adds persistence without affecting API contract