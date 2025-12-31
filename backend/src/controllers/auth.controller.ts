import {Request, Response} from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(req: Request, res: Response) => {
    try{
        const { username, email, password} = req.body;
        console.log("register request received: ", username, email, password);

        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        });

        if (existingUser) {
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })
        res.status(201)
            .json({
                id: user._id,
                username: user.username,
                message:"User Successfully registered"
            });
        console.log("user has been registered");

    } catch (error) {
        res.status(500)
            .json({message:"registration failed"});
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        console.log("login request received: ", email, password);

        const user = await User.findOne({email}).select('+password')
        if (!user) {
            return res.status(401)
                .json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401)
                .json({message:"Invalid credentials"});
        }
        console.log("password matched")

        const jwtToken = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET as string,
            {expiresIn: "1h"}
        )
        res.status(200)
        .json({token: jwtToken})
    } catch (error) {
        res.status(500).json({ message: "Login failed" });    }
}