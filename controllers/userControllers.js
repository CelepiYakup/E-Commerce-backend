const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

require('dotenv').config();
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Email is not valid' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password is not strong enough' });
    }

    try {
        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hash });

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '1h' });

        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(process.env.dateTime, 10)),
        };

        res.status(201).cookie('token', token, cookieOptions).json({
            user,
            token,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Incorrect email' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Incorrect Password' });
        }

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '1h' });

        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(process.env.dateTime, 10)),
        };

        res.cookie("token", token, cookieOptions).json({
            user,
            token
        });

    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
}

const logout = async (req, res) => {
    const token = req.cookies.token; // token'i aldık
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now())
    }

    res.cookie("token", token, cookieOptions).json({
        user: null,
        token: null,
        message: "You are successfully logged out"
    });
}



const forgotPassword = async (req,res) =>{
    
}

const resetPassword = async (req,res) =>{
    
}



module.exports = {register, login, logout, forgotPassword, resetPassword}