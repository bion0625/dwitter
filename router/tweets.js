import express from 'express';
import 'express-async-error';
import { body, param, query } from 'express-validator';
import * as tweetController from '../controller/tweets.js';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateTweet = [
    body('text').trim().isLength({min: 3}).withMessage('text should be at least 3 charaters'),
    validate,
];

// GET /tweets
// GET /tweets?username=username
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', isAuth, validate, tweetController.getTweet)

// POST /tweets
router.post(
    '/', 
    isAuth,
    validateTweet,
    tweetController.createTweet);

// PUT /tweets/:id
router.put(
    '/:id', 
    isAuth,
    validateTweet,
    tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, validate, tweetController.deletTweet);

export default router;