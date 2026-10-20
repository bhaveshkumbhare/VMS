import {Request,Response} from 'express';
import bcrypt from 'bcrypt';
import {User} from '../models/User';
import {registerSchema} from "../validators/auth";

export async function register(req:Request,res:Response){
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({errors:parsed.error.flatten().fieldErrors});
    }

    const {name,email,password} = parsed.data;

    const exists = await User.findOne({email});
    if(exists){
        return res.status(409).json({message:"Email Already registered"})
    }

    const hashed = await bcrypt.hash(password,12);
    const user = await User.create({name,email,password:hashed});

    res.status(201).json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    })
}