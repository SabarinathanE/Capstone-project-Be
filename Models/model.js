import mongoose from "mongoose";

//model schema for users collection in database
const userSchema = new mongoose.Schema({
   email:{
    type:String,
   },
   firstName:{
    type:String,
   },
   lastName:{
    type:String
   },
   password:{
      type:String
   },
   status:{
      type:String
   },
   token:{
      type:String
   }
});

const User=mongoose.model("Users",userSchema);
export {User};