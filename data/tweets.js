import { getTweets } from '../db/database.js';
import { ObjectId } from 'mongodb';
import { findById } from './auth.js';

const mapOptionalTweet = (tweet) => {
    return tweet ? {...tweet, id: tweet._id.toString()} : tweet;
}

const mapTweets = (tweets) => {
    return tweets.map(mapOptionalTweet);
}

export async function getAll(){
    return getTweets()
        .find()
        .sort({ createdAt: -1 })
        .toArray()
        .then(mapTweets)
        ;
}

export async function getAllByUsername(username){
    return getTweets()
        .find({username})
        .sort( {createdAt: -1} )
        .toArray()
        .then(mapTweets)
        ;
}

export async function getById(id){
    return getTweets()
        .findOne({_id:new ObjectId(id)})
        .then(mapOptionalTweet);
}

export async function create(text, userId){
    const {name, username, url} = await findById(userId);
    const tweet = {
        text,
        createdAt: new Date(),
        userId,
        name,
        username,
        url
    }
    return getTweets()
        .insertOne(tweet)
        .then(data => {
            return mapOptionalTweet({...tweet, _id:data.insertedId});
        });
}

export async function update(id, text){
    return getTweets()
        .findOneAndUpdate(
            {_id:new ObjectId(id)}, 
            {$set: {text}},
            {returnDocument: 'after'}
        )
        .then(mapOptionalTweet);
}

export async function remove(id){
    return getTweets().deleteOne({_id:new ObjectId(id)});
}