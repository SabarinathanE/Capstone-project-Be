import mongoose  from "mongoose";
import { ObjectId } from "mongodb";
import { Link } from "../Models/index.js";

//creating task
export default function addTask(data){
    return Link.insertMany(data)
}

//editing task
export function editingTask(data, id){
    return Link.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)} ,data)
   
}

//editing status
export function editingStatus(data, id){
    return Link.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)} ,data, {new: true})
   
}

//deleting tasks
export function deletingTask(id){
    return Link.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)}, {new: true})
   
}

//finding all tasks
export function allTasks(){
    return Link.find()
}

//finding completed tasks
export function completedTask(){
    return Link.find({isCompleted: true})
}

//finding not completed tasks
export function NotCompltedTask(){
    return Link.find({isCompleted: false})
}
