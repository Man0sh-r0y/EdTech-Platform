const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// Here I have wriiten some middleware functions
// It can check whether a user is authenticated 
// and the user has the necessary permissions to access certain routes or resources.
// suppose a student can only access student's routes
// and a instructor can only access instructor's routes
// these things are done by middleware functions

// check if user is authenticated or not
exports.auth = async (req, res, next) => {
    try {
        // Extract token from req 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // check if token is present or not
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        // verify token
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decodedPayload; // set user in req object
            // as later we will use it for authentication and authorization. 
            // We will be able to fetch user details by req.user

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        next(); // It is used to pass control to the next middleware function in the request-response cycle.
        // In this case, it is used to move on to the next middleware function

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while authenticating user",
            error: error.message
        });
    }
}

// Check if user is Student or not
exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to access this resource"
            });
        }
    } catch (error) {
        
    }
}