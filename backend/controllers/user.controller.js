import { User } from "../model/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"

export const register = async (req, res) => {
    try {
        const {userName, email, password} = req.body

        if(!userName || !email || !password) {
            return res.status(401).json({
                message: "Please provide all details",
                success: false
            })
        }

        const user = await User.findOne({email})

        if(user) {
            return res.status(401).json({
                success: false,
                message: "User exists, Please LogIn..."
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        await User.create({
            userName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "User created successfully...",
            user
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(401).json({
                success:false,
                message: "Please fill all details..."
            })
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.status(401).json({
                success:false,
                message: "Invalid credentials..."
            })
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password)

        if(!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials or password"
            })
        }

        user = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
        return res.cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 1*24*60*60*1000}).json({
            success: true,
            message: `Welcome back ${user.userName}`,
            user
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", {maxAge: 0}).json({
            success: true,
            message: "User logoutvsuccessfully..."
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id
        
        const user = await User.findById(userId)

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id
        const {bio, gender} = req.body
        const {profilePicture} = req.file

        // cloudinary
        let cloudResponse;
        if(profilePicture) {
            const fileURI = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileURI)
        }
        
        const user = await User.findById(userId)
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not exists"
            })
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully..."
        })

    } catch (error) {
        console.log(error)
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id: {$ne: req.id}}).select("-password")
        if(!suggestedUsers) {
            return res.status(401).json({
                success: flase,
                message: "Currently don't suggestedUsers"
            })
        }

        return res.status(200).json({
            success: true.valueOf,
            message: "Suggessted User exists",
            users: suggestedUsers
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id  // ansar
        const jiskoFollowKarunga = req.params.id // sahil

        if(followKrneWala === jiskoFollowKarunga) {
            return res.status(401).json({
                success: false,
                message: "You can not follow or unfollow yourself"
            })
        }

        const user = await User.findById(followKrneWala)
        const targetUser = await User.findById(jiskoFollowKarunga)

        if(!user || !targetUser) {
            return res.status(401).json({
                success: false,
                message: "User not found..."
            })
        }

        // mai check karunga pahle se hi follow kiya hai ya nhi
        const isFollowing = user.following.includes(jiskoFollowKarunga)

        if(isFollowing) {
            // unfollow logic aayega
            
        }
        else {
            // follow logic aayega
        }
        
    } catch (error) {
        console.log(error)
    }
}