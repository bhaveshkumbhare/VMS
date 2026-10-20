import {Request,Response} from 'express';
import bcrypt from 'bcrypt';
import {User} from '../models/User';
import {registerSchema} from "../validators/auth";
import jwt from 'jsonwebtoken';
import {loginSchema} from '../validators/auth'

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
};

export async function login(req:Request,res:Response){
    const parsed = loginSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({error:parsed.error.flatten().fieldErrors})
    }

    const {email,password}= parsed.data;

    const user = await User.findOne({email}).select("+password")

    const valid = user && (await bcrypt.compare(password,user.password));
    if(!user || !valid){
        return res.status(401).json({message:"Invalid Email Or password"})
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if(!secret)throw new Error("JWT_ACCESS_SECRET missing in.env");

    const accessToken = jwt.sign({
        sub:user._id.toString(),role:user.role,businessId:user.businessId
    },secret,{
        expiresIn:"15m"
    })
    res.json({
        accessToken,user:{id:user._id,name:user.name,email:user.email,role:user.role}
    })
}