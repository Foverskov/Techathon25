const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
    // Default to index.html for root
    let filePath = req.url === '/' 
        ? path.join(PUBLIC_DIR, 'index.html') 
        : path.join(PUBLIC_DIR, req.url);

    // Get the extension to set correct content type
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(PUBLIC_DIR, '404.html'), (error, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404 || '404 Not Found', 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '172.20.10.6', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${PUBLIC_DIR}`);
});
