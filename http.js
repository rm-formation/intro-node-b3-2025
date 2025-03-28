import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

let tableauMessages = [
    {
        date: new Date(),
        message: "Message 1"
    },
    {
        date: new Date(),
        message: "Message 2"
    }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const route = parsedUrl.pathname;

    if (req.method === 'GET' && route === '/') {
        sendPublicFile('/public/index.html', res);
    } else if (req.method === 'GET' && route.slice(0,7) === '/public') {
        sendPublicFile(route, res);
    } else if (req.method === 'GET' && route === '/getMessages') {
        const number = parsedUrl.query?.number;
        const messages = number ? tableauMessages.slice(0 - number) : tableauMessages;
        res.end(JSON.stringify(messages));
    } else if (req.method === 'GET' && route === '/clearMessages') {
        tableauMessages = [];
        res.end();
    } else if (req.method === 'POST' && route === '/postMessage') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            const json = JSON.parse(data);
            tableauMessages.push(json);
            res.end('Message reçu\n')
        });
    } else {
        res.writeHead(404, {});
        res.end("Not found");
    }
});

server.listen(3000);
console.log("Serveur en écoute sur port 3000");

function sendPublicFile(route, res) {
    const fileName = route.slice(8);
    const filePath = path.join(import.meta.dirname, 'public', fileName);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.end(content);
    } else {
        res.writeHead(404);
        res.end();
    }
}