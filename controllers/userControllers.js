const User = require('../models/user.js')
const bcrypt = require('bcrypt');
const jwt = require('jwt');
const validator = require('validator');
const register = async (res,req) =>{

    const {name,email,password} = req.body;

    if(!email || !password || !name){
        throw Error('All fields must be filled')

    }
    if(!validator.isEmail(emaill)) {
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error ('Password is not strong enough')
    }

    const exist = await this.findOne({ email })
    if(exist){
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hash})

    return user;
}



const login = async (res,req) =>{

    
    const {name,email,password} = req.body;

    if(!email || !password || !name){
        throw Error('All fields must be filled')

    }

    if(!user){
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    
    
}

const logout = async (res,req) =>{
    
}


const forgotPassword = async (res,req) =>{
    
}

const resetPassword = async (res,req) =>{
    
}


module.exports = {register, login, logout, forgotPassword, resetPassword}