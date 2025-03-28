import express from 'express';
import fs from 'fs';
import path from 'path';

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

routerMessages.post('/send', (req, res) => {
    // TODO input validation
    tableauMessages.push(req.body);
    saveMessages();
    res.send('Message reçu');
});

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