const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // Decode URI to handle Czech characters, spaces, etc.
    let decodedUrl = decodeURIComponent(req.url);
    
    // Strip query parameters or hashes
    decodedUrl = decodedUrl.split('?')[0].split('#')[0];
    
    let filePath = '.' + decodedUrl;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Handle specific file extensions and formats from saved web pages
    if (filePath.endsWith('.js.stažený soubor')) {
        contentType = 'application/javascript; charset=utf-8';
    } else if (filePath.includes('css2') || filePath.endsWith('/css') || filePath.includes('css(')) {
        contentType = 'text/css; charset=utf-8';
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 File Not Found</h1><p>Could not find: ' + filePath + '</p>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Internal Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, private'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
    console.log(`Open your browser and visit: http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server.');
});
