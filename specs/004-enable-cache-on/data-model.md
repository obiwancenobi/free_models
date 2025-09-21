# Data Model: Enable Cache on Backend Side

## Overview
This document defines the data structures and entities required for implementing caching functionality on the backend side.

## Entities

### CachedModelData
Represents the cached version of model data retrieved from the external OpenRouter API.

**Fields**:
- `id` (string): Unique identifier for the model
- `name` (string): Human-readable name of the model
- `description` (string): Description of the model's capabilities
- `pricing` (object): Pricing information
  - `prompt` (string): Cost per prompt token
  - `completion` (string): Cost per completion token
- `context_length` (number): Maximum context length
- `created` (string): ISO timestamp of model creation
- `cached_at` (string): ISO timestamp when data was cached
- `expires_at` (string): ISO timestamp when cache expires

**Validation Rules**:
- All fields required except `description`
- `pricing` must contain `prompt` and `completion` fields
- `cached_at` and `expires_at` automatically managed by cache service
- Expiration calculated as `cached_at + 5 minutes`

**Relationships**:
- One-to-one with external API model data
- Managed by CacheService
- Accessed by ModelService

### CacheMetadata
Internal metadata for cache management and monitoring.

**Fields**:
- `key` (string): Cache key (e.g., "models", "model:123")
- `size` (number): Approximate size in bytes
- `hits` (number): Number of cache hits
- `misses` (number): Number of cache misses
- `last_accessed` (string): ISO timestamp of last access
- `created_at` (string): ISO timestamp of cache creation

**Validation Rules**:
- `key` must be unique
- Counters (`hits`, `misses`) initialized to 0
- Timestamps automatically managed

## Data Flow

1. **Cache Miss**: External API data → CachedModelData → Cache storage
2. **Cache Hit**: Cache storage → CachedModelData → API response
3. **Expiration**: Cache entry removed after 5 minutes
4. **Invalidation**: Manual removal via admin endpoint

## Storage Considerations

- **In-Memory**: Using node-cache for fast access
- **Persistence**: No persistence required (cache is transient)
- **Size Limits**: Maximum 100MB cache size
- **Eviction**: LRU (Least Recently Used) when size limit reached

## Schema Evolution

- Versioning: Include version field if schema changes
- Backward Compatibility: Ensure new fields are optional
- Migration: Handle existing cache invalidation on schema changes