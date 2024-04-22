import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

//token generation for login
export function generateToken(id){

    return jwt.sign({id},process.env.SECRET_KEY);
}

//token generation for reset password link
export function generateExpiryToken(id){

    return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:"1h"});
}

//custom authorization middleware
export function isAuthorized(req,res,next){

    //getting headers 
    const token=req.headers["x-auth-token"];
    if(!token){
        res.status(400).json({message:"Access denied"});
    }else{
        //comparing and verifying
        jwt.verify(token,process.env.SECRET_KEY);
        next();
    }
}