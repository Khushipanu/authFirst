import User from "../../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import RefreshToken from "../../models/refreshToken.model.js"


export const register=async(req,res)=>{
    try{
        const {email,password}=req.body;
    if(!email || !password) 
        return res.json({message:"write email and password"});
    const existingUser=await User.findOne({email});
    if(existingUser) return res.json({message:"User already exists"})
    const hashedPass=await bcrypt.hash(password,10);
    const user=await User.create({
        email,
        password:hashedPass
    })
    return res.json({message:"User registered successfully",
        user
    })

    }catch(err){
        res.json({message:"register error"})
    }

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        //get current user-agent
        const userAgent=req.headers["user-agent"];
        const existingSessions=await RefreshToken.find({
            user:user._id,
        })
        const existingSession=existingSessions.find(
            session=>session.userAgent===userAgent
        )
        
        if(!existingSession && existingSessions.length>=3){
           
            existingSessions.sort((a,b)=>a.loginTime-b.loginTime);
            const oldestSession=existingSessions[0];
            RefreshToken.deleteOne({
                _id:oldestSession._id
            })
        }

        //we create it after successful login
        const accessToken=jwt.sign({
            userId:user._id,
            email:user.email
        },process.env.JWT_SECRET,{
            expiresIn:"15m"
        })
        //refresh token
        const refreshToken=crypto.randomBytes(64).toString("hex");
        const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

       
        await RefreshToken.create({
            user:user._id,
            tokenHash:refreshTokenHash,
            userAgent:userAgent,
            loginTime:new Date(),
            expiresAt:new Date(Date.now()+7 * 24 * 60 * 60 * 1000),   
        })

        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:15*60 * 1000

        })
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
        })

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .json({ message: "Something went wrong" });
    }
};

export const refreshAccessToken=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message:"Refresh token missing"})
        }
        const tokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
        const storedHash=await RefreshToken.findOne({tokenHash})
        if(!storedHash){
            return res.status(401).json({message:"Invalid refresh token"})
        }
        //ho but expired ho
        if(storedHash.expiresAt < new Date()){
            await RefreshToken.deleteOne({
                _id:storedHash._id
            })
            return res.status(401).json({
                message:"Refresh token expired"
            })
        
        }
            const newAccessToken=jwt.sign({
                userId:storedHash.user,
            },process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        })
            
        res.cookie("accessToken",newAccessToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:15 * 60 * 1000

        })
        return res.status(200).json({
            message:"Access token refreshed successfully"
        })

    }catch(err){
        return res.status(500).json({message:"Something went wrong"})

    }
}
// export const checkNewLogin=async(req,res)=>{
//     try{
//         const user=await User.findById(req.user.userId);
//         if(!user){
//             return res.status(404).json({message:"User not found"})
//         }
//         await User.findByIdAndUpdate(user._id,{
//             newLogin:true,
//             newLoginUserAgent:userAgent,
//             newLoginTime:new Date(),
//         })
//         return res.status(200).json({
//             newLogin:user.newLogin,
//             userAgent:user.newLoginUserAgent,
//             loginTime:user.newLoginTime,
//         })

//     }catch(err){
//         return res.status(500).json({
//             message:err.message
//         })

//     }
// }
export const checkNewLogin = async (req, res) => {
try {
const user = await User.findById(req.user.userId);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const userAgent = req.headers["user-agent"] || "Unknown";

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            newLogin: true,
            newLoginUserAgent: userAgent,
            newLoginTime: new Date(),
        },
        { new: true }
    );

    return res.status(200).json({
        newLogin: updatedUser.newLogin,
        userAgent: updatedUser.newLoginUserAgent,
        loginTime: updatedUser.newLoginTime,
    });

} catch (err) {
    return res.status(500).json({
        message: err.message
    });
}

};