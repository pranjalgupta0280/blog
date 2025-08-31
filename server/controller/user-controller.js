import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import Token from '../models/token.js'; 

// dotenv.config();
export const signupUser = async (request, response) => {
    try {
        const salt=await bcrypt.genSalt();
        const hashedPassword=await bcrypt.hash(request.body.password,salt);
        const user = {username:request.body.username,name:request.body.name,password:hashedPassword};
        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: "Signup successful" });
    } catch (error) {
        // Log the actual error to the server console for debugging
        console.error("Error during signup:", error);

        // Handle specific error for duplicate username
        if (error.code === 11000) {
            return response.status(409).json({ msg: 'Username already exists. Please choose another one.' });
        }

        // Send a generic error for any other issues
        return response.status(500).json({ msg: 'An internal error occurred while signing up. Please try again later.' });
    }
}
export const loginUser=async(request,response)=>{
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(),'d8cd26def3a468a77bc50bf55fc1f32e9b3caf7511070bbb7cbe52e917aca31a2b98f4d182653c80e23673469a8fc2ade74a34fd70a13a571fe3f3556ee15cbb', { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), '38f0f19151eaeb8f1e8caf3ff97499b2dc51e749613fe6773c89c7b5a65f101bdc1a0ea131d4c87e37797ef012f0a82fce3744598a99973c656cf6267c821f9a');
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}

