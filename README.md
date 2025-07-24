# 🔗 URL Shortener Microservice

FreeCodeCamp Back End Development and APIs Project - URL Shortener Microservice

## 📋 Project Description

A microservice that creates short URLs and redirects them to the original destinations. The service validates URLs using DNS lookup and stores mappings between short and original URLs.

## 🚀 Live Demo

- **Frontend Interface**: [Your deployed URL here]
- **API Endpoint**: [Your deployed URL]/api/shorturl

## 📋 API Documentation

### Create Short URL
```
POST /api/shorturl
```

**Request Body:**
```json
{
  "url": "https://www.example.com"
}
```

**Success Response:**
```json
{
  "original_url": "https://www.example.com",
  "short_url": 1
}
```

**Error Response:**
```json
{
  "error": "invalid url"
}
```

### Redirect to Original URL
```
GET /api/shorturl/:short_url
```

**Example:**
```
GET /api/shorturl/1
```

**Response:** Redirects to the original URL (302 redirect)

### Get All URLs (Testing)
```
GET /api/shorturl
```

**Response:**
```json
{
  "total_urls": 2,
  "urls": [
    {
      "original_url": "https://www.freecodecamp.org",
      "short_url": 1
    },
    {
      "original_url": "https://www.google.com",
      "short_url": 2
    }
  ]
}
```

## 🧪 Test Cases

### 1. Valid URL Shortening
```bash
curl -X POST https://your-app.railway.app/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.freecodecamp.org"}'
```

**Expected Response:**
```json
{
  "original_url": "https://www.freecodecamp.org",
  "short_url": 1
}
```

### 2. URL Redirection
```bash
curl -L https://your-app.railway.app/api/shorturl/1
```

**Expected:** Redirects to https://www.freecodecamp.org

### 3. Invalid URL
```bash
curl -X POST https://your-app.railway.app/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url": "invalid-url"}'
```

**Expected Response:**
```json
{
  "error": "invalid url"
}
```

### 4. Non-existent Domain
```bash
curl -X POST https://your-app.railway.app/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://this-domain-does-not-exist-12345.com"}'
```

**Expected Response:**
```json
{
  "error": "invalid url"
}
```

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/url-shortener-microservice-fcc.git
   cd url-shortener-microservice-fcc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Development mode:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

6. **Test the API:**
   ```bash
   # Create short URL
   curl -X POST http://localhost:3000/api/shorturl \
     -H "Content-Type: application/json" \
     -d '{"url": "https://www.google.com"}'
   
   # Test redirect
   curl -L http://localhost:3000/api/shorturl/1
   ```

## 🔧 Technical Implementation

### URL Validation Process

1. **Format Check**: Verifies URL starts with `http://` or `https://`
2. **URL Parsing**: Uses Node.js `URL` constructor to parse
3. **DNS Lookup**: Uses `dns.lookup()` to verify hostname exists
4. **Storage**: Saves to in-memory database with auto-incrementing ID

### DNS Validation Example
```javascript
const dns = require('dns');

dns.lookup('www.google.com', (err, address) => {
  if (err) {
    console.log('Domain does not exist');
  } else {
    console.log('Domain exists:', address);
  }
});
```

### Storage Structure
```javascript
// In-memory database
const urlDatabase = [
  {
    original_url: "https://www.freecodecamp.org",
    short_url: 1
  },
  {
    original_url: "https://www.google.com", 
    short_url: 2
  }
];
```

## 🚀 Deployment

This project can be deployed on:
- **Railway** (recommended)
- **Vercel**
- **Render** 
- **Heroku**

### Railway Deployment
1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Automatically builds and deploys
4. Generates public URL

### Environment Variables
No environment variables required - uses in-memory storage.

## 📦 Dependencies

- **Express.js**: Web framework for API endpoints
- **CORS**: Cross-origin resource sharing
- **DNS**: Node.js core module for hostname validation
- **URL**: Node.js core module for URL parsing
- **Nodemon**: Development server (dev dependency)

## 🔍 Validation Rules

### Valid URL Formats
- ✅ `https://www.example.com`
- ✅ `http://example.com`
- ✅ `https://subdomain.example.com`
- ✅ `http://www.example.com/path`

### Invalid URL Formats
- ❌ `example.com` (no protocol)
- ❌ `www.example.com` (no protocol)
- ❌ `ftp://example.com` (wrong protocol)
- ❌ `https://nonexistent-domain-12345.com` (DNS fails)

## ✅ FreeCodeCamp Requirements

- [x] POST to `/api/shorturl` returns JSON with `original_url` and `short_url`
- [x] GET `/api/shorturl/<short_url>` redirects to original URL
- [x] Invalid URLs return `{error: 'invalid url'}`
- [x] Uses `dns.lookup()` for URL verification
- [x] Uses body parsing middleware for POST requests
- [x] Follows `http://www.example.com` format validation

## 🧪 Testing Scenarios

### Frontend Testing
1. **Visit Homepage**: Test the interactive interface
2. **Submit Valid URL**: Enter `https://www.google.com`
3. **Click Short Link**: Verify redirect works
4. **Submit Invalid URL**: Test error handling

### API Testing
```bash
# Test valid URL
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.github.com"}'

# Test redirect
curl -I http://localhost:3000/api/shorturl/1

# Test invalid URL
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-url"}'
```

## 🐛 Error Handling

- **Invalid URL Format**: Returns `{error: 'invalid url'}`
- **DNS Lookup Failure**: Returns `{error: 'invalid url'}`
- **Missing URL Parameter**: Returns `{error: 'invalid url'}`
- **Invalid Short URL**: Returns appropriate error message
- **Non-existent Short URL**: Returns error message

## 💾 Data Storage

Currently uses **in-memory storage** which means:
- ✅ Fast access and simple implementation
- ✅ No database setup required
- ❌ Data lost on server restart
- ❌ Not suitable for production scale

For production, consider upgrading to:
- MongoDB (NoSQL)
- PostgreSQL (SQL)
- Redis (Key-value store)

## 📈 Features

- **URL Validation**: Comprehensive format and DNS checking
- **Duplicate Prevention**: Returns existing short URL if already created
- **Error Handling**: Graceful error responses
- **Interactive Frontend**: Beautiful UI for testing
- **Health Monitoring**: `/api/health` endpoint
- **CORS Support**: Cross-origin requests allowed

## 📝 Author

**trucvhc** - Data Engineer 
- GitHub: [@trucvhc](https://github.com/trucvhc)

Created for FreeCodeCamp Back End Development and APIs Certification

## 📄 License

MIT License
