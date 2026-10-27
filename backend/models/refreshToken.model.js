import mongoose from "mongoose"
const refreshTokenSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tokenHash:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    userAgent:{
        type:String,
        required:true
    },
    loginTime:{
        type:Date,
        default:Date.now,
    },
   
}, {timestamps:true})
const refreshToken=mongoose.model("refreshToken",refreshTokenSchema);
export default refreshToken;