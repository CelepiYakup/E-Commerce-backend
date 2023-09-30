const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

require('dotenv').config();
const register = async (req, res) => {

    const avatar = await cloudinary.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width: 130,
        crop: "scale"
    })

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

        const user = await User.create({ 
            name,
            email,
            password: hash,
        avatar:{
            public_id: avatar.public_id,
            url: avatar.secure_url,
        } });

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

    const user = await User.findOne({email: req.body.email})

    if(!user){
        return res.status(500).json({message: "No such user was found."})
    }

    const resetToken =  crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 15*60*1000;

    await user.save({validateBeforeSave:false});

    const passwordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`

    const message = `The token you will use to reset your password. ${passwordUrl}`

    try {

        const transporter = nodemailer.createTransport({
            port: 465,
            service: "gmail",
            host: "smtp.gmail.com",
                auth:{
                    user: 'youremail@gmail.com',
                    pass: 'password',
                },
                secure: true,
        });

        const mailData = {
            from: 'youremail@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            text: message,
        };
        await transporter.sendMail(mailData)

        res.status(200).json({
            message: "Check your mailbox"
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false});

        res.status(500).json({message: error.message})
    }
}

const resetPassword = async (req,res) =>{

    const resetPassowordToken = crypto.createHash("sha256").update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{gt: Date.now()}

    })
    if(!user){
        return res.status(500).json({message:"Unvalid token!!!"})
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    const token = jwt.sign({id: user._id}, "SECRET_TOKEN", {expiresIn:"1h"});

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(process.env.dateTime, 10)),
    };

    res.cookie("token", token, cookieOptions).json({
        user,
        token
    });
}

const userDetail = async(req,res,next) =>{
    const user = await User.findById(req.params.id);
    res.status(200).json({
        user
        
    })
}



module.exports = {register, login, logout, forgotPassword, resetPassword,userDetail}