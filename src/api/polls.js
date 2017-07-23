import express from 'express';
import axios from 'axios';


const pollRouter = express.Router();

pollRouter.route('/')
    .get((req, res) => {
        const url = 'http://jsonplaceholder.typicode.com/posts';

        axios.get(url)
            .then(response => {
                return response.data;
            })
            .then(polls => {
                res.json(polls);
            });
    });


export default pollRouter;
