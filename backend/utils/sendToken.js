const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const sendToken =  asyncHandler(async (user, res)=>{
    let token = jwt.sign({
        id: user._id
        }, process.env.JWT_TOKEN_SECRET, {expiresIn: process.env.JWT_TOKEN_EXPIRY})

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60),
        httpOnly: true
    }
    res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
    })
})

module.exports = sendToken;