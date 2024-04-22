import mongoose from "mongoose";

//model schema for url collection in database
const taskSchema=new mongoose.Schema({

   title:{
    type:String,
    required: true
   },
   content:{
    type:String,
   },
   isCompleted:{
    type:Boolean,
    default: false
   },
   createdOn:{
    type:String
   },

},
{timestamps:true}
);

const Link=mongoose.model("Tasks",taskSchema);
export {Link};