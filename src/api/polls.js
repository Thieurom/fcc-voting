import express from 'express';
import axios from 'axios';
import Auth from '../auth';
import Poll from '../models/poll';


const pollRouter = express.Router();

pollRouter.route('/')
    .get((req, res, next) => {
        Poll.find({}, (err, polls) => {
            if (err) {
                return next(err);
            }
            res.json(polls);
        });
    })
    .post(Auth.requireAuthenticate, (req, res, next) => {
        req.body.voter = req.userId;

        Poll.create(req.body, (err, poll) => {
            if (err) {
                return next(err);
            }
            res.status(201).json(poll);
        });
    });


export default pollRouter;
