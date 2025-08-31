import User from '../models/user.js';
import bcrypt from 'bcrypt'; 

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

