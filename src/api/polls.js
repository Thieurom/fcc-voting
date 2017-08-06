import express from 'express';
import axios from 'axios';
import Auth from '../auth';
import Poll from '../models/poll';


function parseError(error, nOptions) {
    const errors = error.errors;
    let errorMsg = [];

    if (errors.question) {
        errorMsg.push(errors.question.message);
    }

    for (let i = 0; i < nOptions; i++) {
        const idx = `options.${i}.content`;
        if (errors[idx]) {
            errorMsg.push(errors[idx].message);
            break;
        }
    }

    return errorMsg.join(' ');
}


const pollRouter = express.Router();

pollRouter.route('/')
    .get((req, res, next) => {
        Poll.find().sort({ createdAt: -1 })
            .then(polls => { res.json(polls); })
            .catch(err => { next(err); })
    })
    .post(Auth.requireAuthenticate, (req, res, next) => {
        const question = req.body.question;
        const options = req.body.options.map(option => {
            return { content: option };
        });

        Poll.create({ question, options })
            .then(poll => {
                res.status(201).end();
            })
            .catch(error => {
                next(new Error(parseError(error, options.length)));
            });
    });


pollRouter.route('/:pollId')
    .patch(Auth.requireAuthenticate, (req, res, next) => {
        const voter = req.userId;
        const optionId = req.body.option;

        Poll.findOneAndUpdate(
            { 'options._id': optionId, 'voters': { $nin: [voter] }},
            { $inc: { 'options.$.votes': 1 }, $push: { 'voters': voter }},
            { new: true })
            .then(poll => {
                if (!poll) {
                    const error = new Error('You\'ve once voted for this poll.');
                    error.status = 404;

                    return next(error);
                }

                res.status(200).json(poll);
            })
            .catch(err => next(err));
    });


export default pollRouter;
