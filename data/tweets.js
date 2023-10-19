import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;

const Tweets = sequelize.define('tweet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});
Tweets.belongsTo(User);

const Sequelize = SQ.Sequelize;

const INCLUDE_USER = {
    attributes: [
        'id', 
        'text', 
        'createdAt', 
        'userId', 
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.url'), 'url'],
    ],
    include: {
        model: User,
        attributes: [],
    },
};

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
};

export async function getAll(){
    return Tweets.findAll({...INCLUDE_USER, ...ORDER_DESC});
}

export async function getAllByUsername(username){
    return Tweets.findAll({...INCLUDE_USER, ...ORDER_DESC, include: {
        ...INCLUDE_USER.include, where: {username}
    }});
}

export async function getById(id){
    return Tweets.findOne({
        where: {id},
        ...INCLUDE_USER,
    });
}

export async function create(text, userId){
    return Tweets.create({text, userId}).then(data => this.getById(data.dataValues.id));
}

export async function update(id, text){
    return Tweets.findByPk(id, INCLUDE_USER)
        .then(tweet => {
            tweet.text = text;
            return tweet.save();
        });
}

export async function remove(id){
    return Tweets.findByPk(id)
        .then(tweet => {
            tweet.destroy();
        })
}