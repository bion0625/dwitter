import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweets.js';

export const getTweets = async (req, res) => {
    const username = req.query.username;
    const data = await (username 
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
    res.status(200).json(data);
};

export const getTweet = async (req, res) => {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if(tweet){
        return res.status(200).json(tweet);
    }else{
        return res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
};

export const createTweet = async (req, res) => {
    const { body: {text}, userId} = req;
    const tweet = await tweetRepository.create(text, userId);
    res.status(201).json(tweet);
    getSocketIO().emit('tweets', tweet);
};

export const updateTweet = async (req, res) => {
    const {params: {id}, body: {text}, userId} = req;
    const tweet = await tweetRepository.getById(id);
    if(!tweet){
        return res.sendStatus(404);
    }else if(tweet.userId !== userId){
        return res.sendStatus(403);
    }
    const updated = await tweetRepository.update(id, text);
    return res.status(200).json(updated);
};

export const deletTweet = async (req, res) => {
    const {params: {id}, userId} = req;
    const tweet = await tweetRepository.getById(id);
    if(!tweet){
        return res.sendStatus(404);
    }else if(tweet.userId !== userId){
        return res.sendStatus(403);
    }
    await tweetRepository.remove(id);
    return res.sendStatus(204);
};