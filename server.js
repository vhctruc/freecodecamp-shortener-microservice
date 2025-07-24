const express = require('express');
const cors = require('cors');
const dns = require('dns');
const url = require('url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parsing middleware for POST requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname)));

// In-memory storage for URLs
let urlDatabase = [];
let urlCounter = 1;

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to validate URL format
function isValidUrlFormat(urlString) {
  try {
    // Check if URL starts with http:// or https://
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      return false;
    }
    
    // Try to parse the URL
    const parsedUrl = new URL(urlString);
    
    // Check if hostname exists
    if (!parsedUrl.hostname) {
      return false;
    }
    
    // Basic format validation passed
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to verify URL exists using DNS lookup
function verifyUrlExists(urlString) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlString);
      const hostname = parsedUrl.hostname;
      
      // Use dns.lookup to verify the hostname exists
      dns.lookup(hostname, (err, address) => {
        if (err) {
          // DNS lookup failed - hostname doesn't exist
          reject(new Error('Hostname does not exist'));
        } else {
          // DNS lookup successful - hostname exists
          resolve(true);
        }
      });
    } catch (error) {
      reject(new Error('Invalid URL format'));
    }
  });
}

// POST /api/shorturl - Create a short URL
app.post('/api/shorturl', async (req, res) => {
  try {
    const { url: originalUrl } = req.body;
    
    // Check if URL is provided
    if (!originalUrl) {
      return res.json({ error: 'invalid url' });
    }
    
    // Validate URL format
    if (!isValidUrlFormat(originalUrl)) {
      return res.json({ error: 'invalid url' });
    }
    
    // Verify URL exists using DNS lookup
    try {
      await verifyUrlExists(originalUrl);
    } catch (error) {
      return res.json({ error: 'invalid url' });
    }
    
    // Check if URL already exists in database
    const existingUrl = urlDatabase.find(entry => entry.original_url === originalUrl);
    if (existingUrl) {
      return res.json({
        original_url: existingUrl.original_url,
        short_url: existingUrl.short_url
      });
    }
    
    // Create new short URL entry
    const newUrlEntry = {
      original_url: originalUrl,
      short_url: urlCounter
    };
    
    // Add to database and increment counter
    urlDatabase.push(newUrlEntry);
    urlCounter++;
    
    // Return success response
    res.json({
      original_url: newUrlEntry.original_url,
      short_url: newUrlEntry.short_url
    });
    
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.json({ error: 'invalid url' });
  }
});

// GET /api/shorturl/:short_url - Redirect to original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  try {
    const shortUrl = parseInt(req.params.short_url);
    
    // Check if short_url is a valid number
    if (isNaN(shortUrl)) {
      return res.json({ error: 'Wrong format' });
    }
    
    // Find the URL entry in database
    const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);
    
    if (!urlEntry) {
      return res.json({ error: 'No short URL found for the given input' });
    }
    
    // Redirect to the original URL
    res.redirect(urlEntry.original_url);
    
  } catch (error) {
    console.error('Error redirecting:', error);
    res.json({ error: 'No short URL found for the given input' });
  }
});

// GET /api/shorturl - Get all stored URLs (for debugging/testing)
app.get('/api/shorturl', (req, res) => {
  res.json({
    total_urls: urlDatabase.length,
    urls: urlDatabase
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'URL Shortener Microservice',
    total_urls: urlDatabase.length
  });
});

// Handle 404 for API routes
app.get('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available: [
      'POST /api/shorturl',
      'GET /api/shorturl/:short_url',
      'GET /api/shorturl',
      'GET /api/health'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 URL Shortener Microservice running on port', PORT);
  console.log('📡 API available at: http://localhost:' + PORT + '/api/shorturl');
  console.log('🌐 Frontend available at: http://localhost:' + PORT);
  console.log('💾 Using in-memory storage');
});
