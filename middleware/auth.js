 const User = require ('../models/userModel')
const jwt = require('jsonwebtoken')
 const authenticationMid = async (req, res, next) => {
    const {token} = req.cookies;


    if(!token){
        return res.status(500).json({message: "You are not authorized please login"})

    }

    const decodedData = jwt.verify(token, "SECRET_TOKEN");

    if(!decotedData){
        return res.status(500).json({message: "Your access token is invalid."})

    }

    req.user = await User.findById(decodedData.id)
    next();
 }

 const roleChecked = (...roles) => {
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(500).json({message:"You do not have permission to log in."})
        }
        next();
    }
 }

 module.exports = {authenticationMid,roleChecked}