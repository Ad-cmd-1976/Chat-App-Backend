import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generatetoken } from "../lib/util.js";
export const signup=async (req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({messsage:'All fields are required'});
        }
        if(password.length<6){
            return res.status(400).json({messsage:'Password length must be atleast 6'})
        }
        const user=await UserModel.findOne({email});
        if(user){
           return res.status(400).json({message:'User Already Exists!'})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new UserModel({fullName:fullName,email:email,password:hashedPassword});
        if(newUser){
            generatetoken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }
        return res.status(400).json({message:'Invalid User Credentials!'})
    }
    catch(err){
        console.log('Error in signup controller',err);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid User Credentials'});
        const isPasswordEqual=await bcrypt.compare(password,user.password);
        if(!isPasswordEqual) return res.status(400).json({message:'Invalid User Credentials'});
        const token=generatetoken(user._id,res);
        return res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    }
    catch(err){
        console.log("Login controller error",err);
        return res.status(400).json({message:"Internal Server Error"});
    }
}
export const logout=(req,res)=>{
    res.send('logout');
}