import express from 'express';
import fs from 'fs';
import logger from 'winston';
const router = express.Router();

// This will crash app completley
router.get('/crash', (req, res) => {
    fs.readFile('somefile.txt', function(err, data) {
        if (err) throw err;
        console.log(data);
    });
});
    
// This will just throw normal error
router.get('/throw', () => {
    throw new Error('Ahhhh!!!!!');
});

// This will just throw, catch, and log an error
router.get('/catch', (req, res) => {
    try{
        throw new Error('Ahhhh!!!!!');
    } catch(e) {
        logger.error('Recieved and error when trying to do something', e );
        res.sendStatus(500);
    }
});

export default router;