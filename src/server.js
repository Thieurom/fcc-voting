import express from 'express';
import morgan from 'morgan';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './views/components/App';


const app = express();

app.use(morgan('dev'));

// Server settings
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
    const title = 'Votee! Another voting app';
    const content = ReactDOMServer.renderToString(<App />);
    res.render('index', {title, content});
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});
