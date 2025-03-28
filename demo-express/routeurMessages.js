import express from "express";
import { authMiddleware } from "./middlewares.mjs";

const messages = [
    {
        date: new Date(),
        message: "Message 1"
    },
    {
        date: new Date(),
        message: "Message 2"
    }
];

export const routeurMessages = express.Router();

routeurMessages.post('/', authMiddleware);

routeurMessages.get('/getAll', (req, res) => {
    res.json(messages);
});

routeurMessages.post('/send', (req, res) => {
    console.log("POST, body", req.body);
    res.send('ok');
});