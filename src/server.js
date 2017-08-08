import express from 'express';
import morgan from 'morgan';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user';
import usersApi from './api/users';
import pollsApi from './api/polls';
import Auth from './auth';


const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/database';
const SECRET = process.env.SECRET || 'secret-123-456-789';


// Database server
mongoose.Promise = global.Promise;

mongoose.connect(DATABASE, {
    useMongoClient: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error.'));
db.once('open', () => {
    console.log('Connected to server.');
});


// Web-server
const app = express();

app.use('assets', express.static(path.join(__dirname, './assets')));
app.use(bodyParser.json());
app.use(morgan('dev'));


// Config passport
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Server's routes
app.use('/api/polls', pollsApi);
app.use('/api/users', usersApi);
app.use('/login', Auth.login);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});


// Log errors and forward to error handler
app.use((req, res, next) => {
    console.log(err.stack);
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});


// Start serving
app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});
