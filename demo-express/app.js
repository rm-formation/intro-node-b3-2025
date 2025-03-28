import express from 'express';
import { logMiddleware } from './middlewares.mjs';
import path from 'path';
import { routeurMessages } from './routeurMessages.js';

const app = express();

app.use(express.json());

app.use(logMiddleware);

app.use(
    '/public',
    express.static(path.join(import.meta.dirname, '..', 'public'))
);

app.use('/message', routeurMessages);

app.get('/', (req, res) => {
    res.send('OK');
});

app.listen(3000);
console.log("Serveur express en écoute sur le port 3000");