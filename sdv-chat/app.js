import path from 'path';
import express from 'express';
import { routerMessages } from './routers/messages.mjs';
import { routerUsers } from './routers/users.mjs';
import { createServer } from 'http';
import { Server as ServerIO } from 'socket.io';

const app = express();
const serverHTTP = createServer(app);
export const io = new ServerIO(serverHTTP);

const socketsMap = new Map();

// Socket IO
io.on('connection', socket => {
    console.log("Nouvelle connexion");
    socket.on('pseudo', pseudo => {
        socketsMap.set(pseudo, socket);
        socket.broadcast.emit('login', pseudo);
        console.log(`${pseudo} s'est connecté`);

        socket.on('disconnect', () => {
            socket.broadcast.emit('logout', pseudo);
            console.log("Déconnexion");
        });
    });
});

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

// app.use((req, res) => {
//     res.statusCode = 404;
//     res.send('Not found');
// });

serverHTTP.listen(3000);
console.log("Serveur en écoute sur port 3000");
