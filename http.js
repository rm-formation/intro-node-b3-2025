import http from 'http';
import url from 'url';

const tableauMessages = [
    "Message 1",
    "Message 2",
    "Message 3",
    "Message 4",
    "Message 5",
    "Message 6",
    "Message 7",
    "Message 8"
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const route = parsedUrl.pathname;
    console.log("parsedUrl", parsedUrl);
    console.log("method", req.method);

    if (req.method === 'GET' && route === '/') {
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        background-color: lightblue;
                    }
                </style>
            </head>
            <body>
                <h1>TEST</h1>
            </body>
            </html>    
        `); 
    } else if (req.method === 'GET' && route === '/getMessages') {
        const number = parsedUrl.query?.number;
        const messages = number ? tableauMessages.slice(0 - number) : tableauMessages;
        res.end(messages.join('\n'));
    } else if (req.method === 'POST' && route === '/postMessage') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            tableauMessages.push(data);
            res.end('Message reçu\n')
        });
    } else {
        res.end("Not found");
    }
});

server.listen(3000);
console.log("Serveur en écoute sur port 3000");