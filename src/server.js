import express from 'express';
import morgan from 'morgan';


const app = express();

app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.send('Welcome to Voting App!');
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});
