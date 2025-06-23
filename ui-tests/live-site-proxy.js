const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server that forwards to the live site
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Proxying ${req.method} ${req.url} to live site`);
  
  // Proxy to live production site
  proxy.web(req, res, {
    target: 'http://test.app.alchemorsel.com',
    changeOrigin: true,
    ws: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);
  if (res && !res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  }
});

const PORT = 8175;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Live site proxy running on port ${PORT}`);
  console.log(`📱 Access via: http://localhost:${PORT}`);
  console.log(`🎯 Proxying to: http://test.app.alchemorsel.com`);
});

module.exports = server;