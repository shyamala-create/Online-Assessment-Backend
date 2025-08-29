import {Request, Response} from "express";
import userSchema, { IUser } from "../models/userSchema";
import bcrypt from "bcryptjs/umd/types";

const AuthController = {
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await userSchema.find();

            res.status(200).json(users);

        } catch (err){
            res.status(500).json({message: "Error fetching user details", error: err})
        }
    },
    registerUser: async(req: Request, res: Response) => {
        const { users } = req.body
        const user = await userSchema.updateOne<IUser>(users);

        res.status(200).json({message: "User updated successfully", user})
    },
    loginUser: async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body
            const user = userSchema.findOne({email})
            if(!user){
                res.status(400).json({
                    message: "User not in database, Please register and login"
                })
            }

            // const isValidPassword = bcrypt.compare(password, );
        } catch(err) {
            res.status(500).json({message: "Error login user"})
        }
    } 
}

export default AuthController;