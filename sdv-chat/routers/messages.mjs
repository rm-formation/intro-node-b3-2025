import express from 'express';
import fs from 'fs';
import path from 'path';
import { io } from '../app.js';
import yup from 'yup';
import { sanitize } from 'string-sanitizer/index.js'; 

const saveFilePath = path.join(import.meta.dirname, '..', 'messagesSaveFile.json'); 

export const routerMessages = express.Router();

let tableauMessages = loadMessages();

routerMessages.get('/get/:number?', (req, res) => {
    const number = req.params.number;
    const messages = number ? tableauMessages.slice(0 - number) : tableauMessages;
    res.json(messages);
});

routerMessages.get('/clear', (req, res) => {
    tableauMessages = [];
    res.send();
});

routerMessages.post('/send', async (req, res) => {
    let message = req.body;
    let valide = true;
    try {
        await messageSchema.validate(message);
    } catch(e) {
        valide = false;
    }

    if (!valide) {
        res.statusCode = 400;
        res.send();
        return;
    }

    message = {
        pseudo: sanitize(message.pseudo),
        date: message.date,
        message: message.message.replace(/[<>\/\\%]/g, '') //Exemple, à ne pas prendre tel quel !
    }

    tableauMessages.push(message);
    saveMessages();
    io.emit('message', message);
    res.send('Message reçu');
});

const messageSchema = yup.object({
    pseudo: yup.string().required(),
    date: yup.date().required(),
    message: yup.string().required()
}).noUnknown();

function saveMessages() {
    fs.writeFileSync(saveFilePath, JSON.stringify(tableauMessages), 'utf-8');
}

function loadMessages() {
    if (fs.existsSync(saveFilePath)) {
        return JSON.parse(fs.readFileSync(saveFilePath, 'utf-8'));
    } else {
        return [];
    }
}