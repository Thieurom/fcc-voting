import express from 'express';
import morgan from 'morgan';
import path from 'path';
import React from 'react';

import App from './components/App';


const app = express();

app.use(morgan('dev'));

// Server settings
app.use('assets', express.static(path.join(__dirname, './assets')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});
