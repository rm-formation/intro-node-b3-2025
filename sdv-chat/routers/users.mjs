import express from 'express';

export const routerUsers = express.Router();

const pseudosSet = new Set();

routerUsers.post('/register', (req, res) => {
    const pseudo = req.body.pseudo;
    if (pseudosSet.has(pseudo)) {
        res.statusCode = 401;
        res.send();
    } else {
        pseudosSet.add(pseudo);
        res.send();
    }
});