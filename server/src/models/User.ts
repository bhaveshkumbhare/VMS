import {Schema,model} from 'mongoose'
const userSchema = new Schema({
    name:{
        type : String,
        required : true,
        trim:true
    },
        email:{
        type : String,
        required : true,
        trim:true,
        unique:true,
        lowercase:true
    },
        password:{
        type : String,
        required : true,
        select:false
    },
        role:{
        type : String,
        enum:["owner","staff","customer"],
        default:"customer"
    },
    businessId : {
        type : Schema.Types.ObjectId,
        ref:"Business"
    }
}, {timestamps:true});

export const User = model("User",userSchema);
