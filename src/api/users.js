import express from 'express';
import passport from 'passport';
import User from '../models/user';


const userRouter = express.Router();

userRouter.route('/')
    .post((req, res, next) => {
        const { username, password } = req.body;

        User.register(new User({ username }), password, (err, user) => {
            if (err) {
                return next(err);
            }

            res.status(201).end();
        });
    });


export default userRouter;
