import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from "../data/auth.js";
import { config } from '../config.js';

const createJwtToken =id => jwt.sign({id}, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
});

const setToken = (res, token) => {
    const options = {
        maxAge: config.jwt.expiresInSec * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }
    res.cookie('token', token, options)// HTTP-ONLY
}

const generateCSRFToken = () => {
    return bcrypt.hash(config.csrf.plainToken, 1)
};

export const signup = async (req, res) => {
    const { username, password, name, email, url} = req.body;
    const found = await userRepository.findByUsername(username);
    if(found){
        return res.status(409).json({ message: `${username} already exists` })
    }
    const hashed = await bcrypt.hash(password, config.becrypt.saltRounds);
    const userId = await userRepository.createUser({
        username, 
        password: hashed, 
        name, 
        email, 
        url,
    });
    const token = createJwtToken(userId); //cookie header
    setToken(res, token);
    res.status(201).json({token, username});
}

export const login = async (req, res) => {
    const { body : {
        username,
        password
    }} = req;
    const user = await userRepository.findByUsername(username);
    if(!user){
        return res.status(401).json({message:"Invalid user or password"});
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return res.status(401).json({message:"Invalid user or password"});
    }
    const token = createJwtToken(user.id);
    setToken(res, token);
    res.status(200).json({token, username});
};

export const logout = (req, res) => {
    res.cookie('token', '');
    res.status(200).json({message: 'User has been logged out'});
}

export const me = async (req, res) => {
    const user = await userRepository.findById(req.userId);
    if (!user){
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ token: req.token, username: user.username });
};

export const csrfToken = async (req, res) => {
    const csrfToken = await generateCSRFToken();
    res.status(200).json({csrfToken});
};