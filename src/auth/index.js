import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';


const SECRET = process.env.SECRET || 'secret-123-456-789';

const Auth = {
    login: express.Router().post('/', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                const error = new Error();
                error.message = info.message;
                error.status = 401;
                return next(error);
            }
            req.login(user, (err) => {
                if (err) return next(err);

                const payload = {
                    userId: user._id
                };
                const token = jwt.sign(payload, SECRET, {expiresIn: 3600});
                return res.status(200).json({
                    status: 'Login Successful.',
                    success: true,
                    token
                });
            });
        })(req, res, next);
    }),

    requireAuthenticate(req, res, next) {
        let token;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    const error = new Error('You are not authenticated.');
                    error.status = 401;
                    return next(err);

                } else {
                    const userId = decoded.userId;

                    User.findById(userId, (err, user) => {
                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            return res.status(401).end();
                        }
                        next();
                    });
                }
            });

        } else {
            const error = new Error('No token provided.');
            error.status = 403;
            next(error);
        }
    }
};

export default Auth;
