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
            .catch(error => { next(error); })
    })
    .post(Auth.requireAuthenticate, (req, res, next) => {
        const question = req.body.question;
        const options = req.body.options.map(option => {
            return { content: option };
        });
        const creator = req.userId;

        Poll.create({ question, options, creator })
            .then(poll => {
                res.status(201).end();
            })
            .catch(error => {
                next(new Error(parseError(error, options.length)));
            });
    });


pollRouter.get('/current_user', Auth.requireAuthenticate, (req, res, next) => {
    Poll.find({ creator: req.userId }).sort({ createdAt: -1 })
        .then(polls => { res.json(polls); })
        .catch(error => { next(error); })
});


pollRouter.patch('/:pollId/votes', Auth.requireAuthenticate, (req, res, next) => {
    const voter = req.userId;
    const optionId = req.body.option;

    Poll.findOneAndUpdate(
        { 'options._id': optionId, 'voters': { $nin: [voter] }},
        { $inc: { 'options.$.votes': 1 }, $push: { 'voters': voter }},
        { new: true })
        .then(updatedPoll => {
            if (!updatedPoll) {
                const error = new Error('You\'ve once voted for this poll.');
                error.status = 403;

                return next(error);
            }

            res.status(200).json(updatedPoll);
        })
        .catch(error => next(error));
});


pollRouter.patch('/:pollId/options', Auth.requireAuthenticate, (req, res, next) => {
    const pollId = req.params['pollId'];
    const options = req.body.options.map(option => {
        return { content: option };
    });

    Poll.findById(pollId)
        .then(poll => {
            poll.options.push(...options);
            return poll.save();
        })
        .then(updatedPoll => {
            res.status(200).json(updatedPoll);
        })
        .catch(error => next(error));
});


pollRouter.delete('/:pollId', Auth.requireAuthenticate, (req, res, next) => {
    const pollId = req.params['pollId'];

    Poll.findByIdAndRemove(pollId)
        .then(poll => {
            res.status(200).json(poll);
        })
        .catch(error => next(error));
})


export default pollRouter;
