# Quickstart: Enable Cache on Backend Side

## Overview
This guide provides step-by-step instructions to test and validate the caching functionality implemented on the backend side.

## Prerequisites
- Backend server running on `http://localhost:3001`
- Valid OpenRouter API key configured
- Internet connection for external API calls

## Test Scenarios

### 1. Cache Miss (First Request)
**Description**: Verify that the first request fetches data from external API and caches it.

**Steps**:
1. Ensure cache is empty (restart server if needed)
2. Make GET request to `/api/models`
3. Observe response time (should be slower, ~1-2 seconds)
4. Check server logs for "Fetching models from OpenRouter API"

**Expected Result**:
- HTTP 200 with models data
- Response includes cache metadata headers (if implemented)
- Data stored in cache for 5 minutes

### 2. Cache Hit (Subsequent Requests)
**Description**: Verify that cached data is returned for repeated requests.

**Steps**:
1. Immediately make another GET request to `/api/models`
2. Observe response time (should be faster, <100ms)
3. Check server logs for "Returning cached models data"

**Expected Result**:
- HTTP 200 with same models data
- Significantly faster response
- No external API call made

### 3. Cache Expiration
**Description**: Verify that cache expires after 5 minutes and fresh data is fetched.

**Steps**:
1. Wait 5 minutes after first request
2. Make GET request to `/api/models`
3. Observe response time (should be slower again)
4. Check server logs for "Cache expired, fetching fresh data"

**Expected Result**:
- HTTP 200 with potentially updated data
- Slower response time
- External API call made

### 4. Individual Model Caching
**Description**: Test caching for individual model requests.

**Steps**:
1. Make GET request to `/api/models/{id}` for a specific model
2. Make the same request again immediately
3. Compare response times

**Expected Result**:
- First request: slower (cache miss)
- Second request: faster (cache hit)

### 5. Cache Invalidation (Admin)
**Description**: Test manual cache invalidation via admin endpoint.

**Steps**:
1. Ensure data is cached
2. Make POST request to `/api/cache/invalidate`
   ```bash
   curl -X POST http://localhost:3001/api/cache/invalidate \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```
3. Make GET request to `/api/models`
4. Observe response time

**Expected Result**:
- Invalidation: HTTP 200 with success message
- Next request: slower (cache miss, fresh data fetched)

### 6. Cache Statistics
**Description**: View cache performance statistics.

**Steps**:
1. Make several requests to generate statistics
2. Make GET request to `/api/cache/stats`
   ```bash
   curl http://localhost:3001/api/cache/stats \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

**Expected Result**:
- HTTP 200 with statistics object
- Includes hit ratio, total entries, size information

## Performance Validation

### Response Time Benchmarks
- **Cache Hit**: < 50ms
- **Cache Miss**: 500-2000ms (depending on external API)
- **Cache Expiration**: Similar to cache miss

### Load Testing
Use tools like Apache Bench or Artillery to test under load:
```bash
# Test with 10 concurrent users, 100 requests
ab -n 100 -c 10 http://localhost:3001/api/models
```

**Expected Results**:
- High cache hit ratio (>80%)
- Consistent response times
- No memory leaks

## Troubleshooting

### Common Issues

1. **Slow First Request**
   - Check internet connection
   - Verify OpenRouter API key
   - Check external API status

2. **Cache Not Working**
   - Verify node-cache dependency installed
   - Check server logs for cache-related errors
   - Ensure cache service is properly initialized

3. **Memory Issues**
   - Monitor cache size via `/api/cache/stats`
   - Check for memory leaks in application
   - Adjust cache size limits if needed

4. **Authentication Errors**
   - Ensure valid admin token for cache endpoints
   - Check token expiration
   - Verify authentication middleware

### Debug Commands
```bash
# Check server logs
tail -f backend/logs/app.log

# Monitor memory usage
node --inspect backend/src/app.js

# Test API endpoints
curl -w "@curl-format.txt" http://localhost:3001/api/models
```

## Next Steps
After validating the cache functionality:
1. Run full test suite
2. Perform load testing
3. Monitor production performance
4. Adjust cache settings based on usage patterns