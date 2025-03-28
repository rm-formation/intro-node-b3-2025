import express from 'express';

export const routerMessages = express.Router();

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
    res.send('Message reçu');
});