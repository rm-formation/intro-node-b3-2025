import path from 'path';
import express from 'express';
import { routerMessages } from './routers/messages.mjs';
import { routerUsers } from './routers/users.mjs';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'index.html'));
});

app.use(
    '/public',
    express.static(path.join(import.meta.dirname, 'public'))
);

app.use('/message', routerMessages);
app.use('/user', routerUsers);

app.use((req, res) => {
    res.statusCode = 404;
    res.send('Not found');
});

app.listen(3000);
console.log("Serveur en écoute sur port 3000");
