import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    newLogin:{
        type:Boolean,
        default:false
    },
    newLoginUserAgent:{
        type:String,
        default:null,
    },
    newLoginTime:{
        type:Date,
        default:null
    }
},{
        timestamps:true
    })

const User=mongoose.model("User",userSchema);
export default User;
