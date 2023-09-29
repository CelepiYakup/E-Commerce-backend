const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const register = async (res,req) =>{

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

        const user = await User.create({ email, password: hash });

        return res.status(201).json({ user });
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
}



const login = async (res,req) =>{

    
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

      

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
    
}

const logout = async (res,req) =>{
    
}


const forgotPassword = async (res,req) =>{
    
}

const resetPassword = async (res,req) =>{
    
}

const User = mongoose.model('User', userSchema);


module.exports = {register, login, logout, forgotPassword, resetPassword}