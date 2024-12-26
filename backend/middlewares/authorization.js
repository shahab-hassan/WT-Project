const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
const authModel = require("../models/userModel");

exports.authorized = asyncHandler(async(req, res, next)=>{
    let {token} = req.cookies;
    if(!token){
        res.status(401)
        throw new Error("Please login to access this resource!")
    }
    const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = await authModel.findById(decode.id);
    next();
})