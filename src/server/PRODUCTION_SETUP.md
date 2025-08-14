# Production Setup Guide

## 🚨 Critical: Fix Session & CORS Issues

The session persistence and cart issues in production are caused by CORS and cookie configuration problems. Follow these steps to fix them:

## 1. Environment Variables Setup

Create a `.env` file in your production environment with these variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Security
COOKIE_SECRET=your-super-secure-cookie-secret-key
SESSION_SECRET=your-super-secure-session-secret-key

# CORS Configuration - CRITICAL FOR SESSION PERSISTENCE
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com

# Cookie Domain - CRITICAL FOR SESSION PERSISTENCE
COOKIE_DOMAIN=.yourdomain.com

# Database
DATABASE_URL=your-production-database-url

# Redis
REDIS_URL=your-production-redis-url
```

## 2. Frontend Configuration

Make sure your frontend is configured to send credentials with requests:

### For Axios:

```javascript
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://your-api-domain.com";
```

### For Fetch:

```javascript
fetch("/api/auth/login", {
  method: "POST",
  credentials: "include", // CRITICAL
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(loginData),
});
```

### For React Query:

```javascript
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      credentials: "include",
    },
  },
});
```

## 3. Domain Configuration

### If your frontend and backend are on the same domain:

```bash
# Frontend: https://yourdomain.com
# Backend: https://yourdomain.com/api

ALLOWED_ORIGINS=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com
```

### If your frontend and backend are on different subdomains:

```bash
# Frontend: https://app.yourdomain.com
# Backend: https://api.yourdomain.com

ALLOWED_ORIGINS=https://app.yourdomain.com
COOKIE_DOMAIN=.yourdomain.com  # Note the leading dot
```

### If your frontend and backend are on completely different domains:

```bash
# Frontend: https://myapp.com
# Backend: https://api.myapp.com

ALLOWED_ORIGINS=https://myapp.com
COOKIE_DOMAIN=myapp.com
```

## 4. Testing the Configuration

### Test CORS:

```bash
curl -X OPTIONS https://your-api-domain.com/api/auth/login \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### Test Session:

```bash
# Login
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://yourdomain.com" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt \
  -v

# Test session persistence
curl -X GET https://your-api-domain.com/api/auth/me \
  -H "Origin: https://yourdomain.com" \
  -b cookies.txt \
  -v
```

## 5. Common Issues and Solutions

### Issue: "Session not persisting after login"

**Solution:**

1. Check `ALLOWED_ORIGINS` includes your frontend domain
2. Check `COOKIE_DOMAIN` is set correctly
3. Ensure frontend sends `credentials: 'include'`
4. Verify `sameSite` cookie setting

### Issue: "CORS errors in browser console"

**Solution:**

1. Add your frontend domain to `ALLOWED_ORIGINS`
2. Check that `credentials: true` is set in CORS config
3. Verify preflight requests are handled

### Issue: "Cart items not showing after adding"

**Solution:**

1. Check session persistence (same as above)
2. Verify cart endpoints are using session-based authentication
3. Check that cart data is being stored in session/Redis

## 6. Security Considerations

### For Production:

```bash
# Always use HTTPS in production
NODE_ENV=production

# Use strong secrets
COOKIE_SECRET=your-very-long-random-secret-key
SESSION_SECRET=your-very-long-random-session-secret

# Restrict CORS origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Use secure cookies
secure: true
sameSite: "none"  # For cross-domain cookies
```

## 7. Debugging Steps

### 1. Check CORS Headers:

```bash
curl -I https://your-api-domain.com/api/auth/login \
  -H "Origin: https://yourdomain.com"
```

### 2. Check Cookie Settings:

```bash
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v
```

### 3. Check Session Storage:

```bash
# Check Redis for session data
redis-cli KEYS "sess:*"
```

### 4. Monitor Server Logs:

```bash
# Check for CORS warnings
grep "CORS blocked origin" /var/log/your-app.log

# Check for session errors
grep "session" /var/log/your-app.log
```

## 8. Quick Fix Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with your frontend domain
- [ ] Set `COOKIE_DOMAIN` correctly
- [ ] Ensure frontend sends `credentials: 'include'`
- [ ] Use HTTPS in production
- [ ] Set strong `COOKIE_SECRET` and `SESSION_SECRET`
- [ ] Test CORS preflight requests
- [ ] Test session persistence
- [ ] Monitor server logs for errors

## 9. Example Working Configuration

```bash
# .env.production
NODE_ENV=production
PORT=5000
COOKIE_SECRET=your-64-character-random-secret-key-here
SESSION_SECRET=your-64-character-random-session-secret-here
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
COOKIE_DOMAIN=.myapp.com
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
```

After applying these configurations, restart your server and test the authentication and cart functionality. The session persistence issues should be resolved.
