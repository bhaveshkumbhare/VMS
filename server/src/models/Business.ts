import {Schema,model} from "mongoose"

const businessSchema = new Schema({
    name:{ type:String,required:true,trim:true},
    slug:{type:String,required:true,unique:true,lowercase:true,trim:true},
    owner:{type:Schema.Types.ObjectId, ref:"User",required:true}
},{timestamps:true});

export const Business = model("Business",businessSchema);
