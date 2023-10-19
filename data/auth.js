import SQ from 'sequelize';
import { sequelize } from "../db/database.js";
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        url: DataTypes.TEXT,
    }, 
    { timestamps: false }
);

export const findById = async (id) => {
    return User.findByPk(id);
};

export const createUser = async (user) => {
    return User.create(user).then(data => {console.log(data); return data.dataValues.id});
};

export const findByUsername = async (username) => {
    return User.findOne({where: {username}});
};