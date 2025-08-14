# Node.js Server - Browser/Device Compatibility & Best Practices

This Node.js server has been enhanced with comprehensive browser and device compatibility features, security best practices, and production-ready configurations.

## 🚀 Features

### Browser & Device Compatibility

#### 1. **Enhanced CORS Configuration**

- **Multi-origin support**: Configurable allowed origins for different environments
- **Mobile app support**: Allows requests with no origin (mobile apps, curl)
- **Flexible headers**: Supports custom headers for device detection and API versioning
- **Preflight handling**: Proper OPTIONS request handling for complex requests

#### 2. **Device Detection**

- **Automatic detection**: Detects device type (mobile, tablet, desktop)
- **Platform identification**: Identifies iOS, Android, or web platforms
- **Browser detection**: Detects browser type and version
- **Response headers**: Adds device info to response headers for client-side handling

#### 3. **API Versioning**

- **Multiple version support**: Supports v1, v2, etc.
- **Flexible versioning**: Version can be specified via URL, headers, or query params
- **Backward compatibility**: Ensures API changes don't break existing clients
- **Version validation**: Validates requested versions and provides helpful error messages

### Security Best Practices

#### 1. **Enhanced Security Headers**

- **Content Security Policy**: Prevents XSS attacks
- **HSTS**: Forces HTTPS connections
- **Frame protection**: Prevents clickjacking attacks
- **XSS protection**: Additional XSS filtering
- **Referrer policy**: Controls referrer information

#### 2. **Input Validation & Sanitization**

- **Request size limits**: Prevents large payload attacks
- **MongoDB sanitization**: Prevents NoSQL injection
- **XSS cleaning**: Removes malicious scripts
- **Parameter pollution protection**: Prevents HTTP parameter pollution

#### 3. **Rate Limiting**

- **IP-based limiting**: Prevents abuse from single sources
- **Configurable windows**: 15-minute windows with 100 requests per IP
- **Standard headers**: Includes rate limit info in response headers

### Production Readiness

#### 1. **Health Checks**

- **Basic health check**: `/health` - Simple status endpoint
- **Detailed health check**: `/health/detailed` - Full system status
- **Kubernetes probes**: `/ready` and `/live` endpoints for container orchestration
- **Dependency monitoring**: Database and Redis connection status

#### 2. **Graceful Shutdown**

- **Signal handling**: Proper SIGTERM and SIGINT handling
- **Connection cleanup**: Closes server gracefully
- **Timeout protection**: Forces shutdown after 30 seconds
- **Error logging**: Comprehensive error tracking

#### 3. **Enhanced Error Handling**

- **Device-aware errors**: Different error responses based on device type
- **Helpful messages**: Provides guidance for common errors
- **Structured responses**: Consistent error format across all endpoints
- **Development support**: Stack traces in development mode

#### 4. **Request Timeout Handling**

- **Configurable timeouts**: 30-second default timeout
- **Request/response timeouts**: Separate handling for both
- **Graceful degradation**: Proper timeout responses

## 📋 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Security
COOKIE_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Request Limits
REQUEST_LIMIT_JSON=10mb
REQUEST_LIMIT_URLENCODED=10mb
REQUEST_LIMIT_RAW=50mb

# Timeouts
RESPONSE_TIMEOUT=30000  # 30 seconds
```

### CORS Configuration

The server supports multiple origins and automatically handles:

- Development environments (localhost variants)
- Production domains
- Mobile applications
- API clients

### Security Headers

All security headers are automatically configured for:

- Modern browsers
- Mobile devices
- API clients
- Cross-origin requests

## 🔧 Usage Examples

### API Versioning

```javascript
// URL-based versioning
GET /api/v1/users
GET /api/v2/users

// Header-based versioning
GET /api/users
X-API-Version: v2

// Query parameter versioning
GET /api/users?version=v2
```

### Device Detection

```javascript
// Server automatically detects and adds headers:
X-Device-Type: mobile
X-Platform: ios
X-Browser: Safari
X-Browser-Version: 15
```

### Health Checks

```bash
# Basic health check
curl http://localhost:5000/health

# Detailed health check
curl http://localhost:5000/health/detailed

# Kubernetes readiness probe
curl http://localhost:5000/ready

# Kubernetes liveness probe
curl http://localhost:5000/live
```

## 🛡️ Security Features

### Request Validation

- **Size limits**: Prevents large payload attacks
- **Content validation**: Validates JSON and form data
- **Header validation**: Validates required headers
- **Method validation**: Only allows specified HTTP methods

### Error Handling

- **No information leakage**: Doesn't expose internal errors
- **Structured responses**: Consistent error format
- **Logging**: Comprehensive error logging for debugging
- **Rate limiting**: Prevents abuse and DoS attacks

## 📱 Mobile Compatibility

### Mobile-Specific Features

- **Touch-friendly endpoints**: Optimized for mobile interactions
- **Reduced payload sizes**: Efficient data transfer
- **Offline support**: Graceful handling of network issues
- **Progressive enhancement**: Works with basic browsers

### Device Detection

- **Automatic detection**: No client-side code required
- **Platform-specific responses**: Tailored responses for different platforms
- **Browser compatibility**: Works with all major mobile browsers

## 🚀 Performance Optimizations

### Compression

- **Gzip compression**: Reduces response sizes
- **Selective compression**: Only compresses appropriate content types
- **Configurable levels**: Adjustable compression levels

### Caching

- **ETag support**: Efficient caching headers
- **Cache control**: Proper cache directives
- **Conditional requests**: Support for If-Modified-Since headers

## 📊 Monitoring & Logging

### Health Monitoring

- **Real-time status**: Live system health information
- **Dependency monitoring**: Database and external service status
- **Performance metrics**: Response times and throughput
- **Error tracking**: Comprehensive error logging

### Logging

- **Structured logging**: JSON format for easy parsing
- **Request logging**: All requests are logged with metadata
- **Error logging**: Detailed error information
- **Performance logging**: Response times and resource usage

## 🔄 Deployment

### Docker Support

The server includes Docker configuration for easy deployment:

```bash
# Build the image
docker build -t your-app .

# Run the container
docker run -p 5000:5000 your-app
```

### Environment-Specific Configurations

- **Development**: Enhanced debugging and logging
- **Production**: Optimized for performance and security
- **Testing**: Isolated configuration for testing

## 📚 API Documentation

### Swagger Integration

- **Auto-generated docs**: Based on route definitions
- **Interactive testing**: Test endpoints directly from docs
- **Schema validation**: Automatic request/response validation
- **Version support**: Documentation for each API version

## 🧪 Testing

### Health Check Testing

```bash
# Test basic health
curl -f http://localhost:5000/health

# Test detailed health
curl -f http://localhost:5000/health/detailed

# Test readiness
curl -f http://localhost:5000/ready
```

### CORS Testing

```bash
# Test CORS preflight
curl -X OPTIONS -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  http://localhost:5000/api/v1/users
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check allowed origins configuration
   - Verify preflight request handling
   - Ensure credentials are properly configured

2. **Rate Limiting**

   - Check rate limit configuration
   - Monitor rate limit headers in responses
   - Adjust limits for your use case

3. **Timeout Issues**

   - Check request/response timeout settings
   - Monitor server performance
   - Optimize slow database queries

4. **Health Check Failures**
   - Verify database connectivity
   - Check Redis connection
   - Review server logs for errors

## 📈 Best Practices

### Development

1. **Use environment variables** for configuration
2. **Test with different devices** and browsers
3. **Monitor health checks** during development
4. **Use structured logging** for debugging

### Production

1. **Set up monitoring** for health checks
2. **Configure proper CORS** for your domains
3. **Use HTTPS** in production
4. **Monitor rate limiting** and adjust as needed
5. **Set up alerting** for health check failures

### Security

1. **Regularly update dependencies**
2. **Monitor security headers**
3. **Use strong secrets** for cookies and sessions
4. **Implement proper authentication**
5. **Monitor for suspicious activity**

This server is now production-ready with comprehensive browser and device compatibility, security best practices, and monitoring capabilities.
