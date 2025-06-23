const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
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
  
  // Proxy to frontend container
  proxy.web(req, res, {
    target: 'http://172.19.0.5:5173',
    changeOrigin: true,
    ws: true
  });
});

proxy.on('error', (err) => {
  console.error('Proxy error:', err);
});

server.listen(8174, '0.0.0.0', () => {
  console.log('Proxy server running on port 8174');
});