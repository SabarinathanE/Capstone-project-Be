import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import { activation,findUser, findingUser, forgotToken, updatingPassword } from "../Controllers/Url.js";
import addingUser from "../Controllers/Url.js";
import { transport } from "../Mailers/NodeMailer.js";
import { generateExpiryToken, generateToken, isAuthorized } from "../Autherise/Auth.js";
import  { NotCompltedTask, allTasks, completedTask, deletingTask, editingStatus, editingTask } from "../Controllers/Link.js";
import addTask from "../Controllers/Link.js";

//initializing router
const router=express.Router();

//user registration
router.post("/register",async(req,res)=>{

    try {
        //finding if user already registered with the emailid
        const findUser=await findingUser(req.body.email);
        if(findUser.length>=1){
            return res.status(400).json({message:"User email already registered"});
        }else{
            //encrypting user password
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(req.body.password,salt);
            //creating object with user details
            const data={
                email:req.body.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                password:hashedPassword,
                status:"InActive",
                token:""
            }

            //adding user to the db
            const registeringUser=await addingUser(data);

            //sending mail to activate account
            const link=`https://capstone-project-task.netlify.app/activation/${registeringUser[0]._id}`

            //composing mail
            const composingMail={
                from: process.env.Email,
                to:registeringUser[0].email,
                subject:"Account Activation Link",
                html:`<a href=${link}>${link}</a>`
            }

            //creating transport to send mail
            transport.sendMail(composingMail,(error,info)=>{

                if(error){
                    console.log(error)
                }else{
                    console.log("mail sent")
                }
            })
            return res.status(200).json({message:"Activation link sent to Mail",data:registeringUser})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Registration failed"})
    }
})

//account activation
router.get("/activation/:id",async(req,res)=>{

    try {
        //finding user and updating account status
         const activateUser=await activation(req.params.id);

         if(!activateUser){
            return res.status(400).json({message:"Invalid link or Link Expired"});
         }else{
            return res.status(200).json({message:"Activation Successfull"})
         }
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Account activation failed"})
    }
})

//login User
router.post("/login",async(req,res)=>{

    try {
        //checking is user email is registered 
        const checkUser=await findingUser(req.body.email);
        if(checkUser.length===0){
            return res.status(400).json({message:"Invalid email"});
        }else{ 
            //validating password with email
            const validatingPassword=await bcrypt.compare(req.body.password,checkUser[0].password);

            if(validatingPassword){

                //checking if account is active or not
                if(checkUser[0].status==="Active"){
                    //token is generated and passed as response
                    const token=generateToken(checkUser[0]._id);
                    return res.status(200).json({message:"login success",token,data:checkUser})
                }else{
                    //if account is not active
                     //sending mail to activate account
                    const link=`https://capstone-project-task.netlify.app/activation/${checkUser[0]._id}`

                    //composing mail
                    const composingMail={
                        from:process.env.Email,
                        to:checkUser[0].email,
                        subject:"Account Activation Link",
                        html:`<a href=${link}>${link}</a>
                        `
                    }

                    //creating transport to send mail
                    transport.sendMail(composingMail,(error,info)=>{
                        if(error){
                            console.log(error)
                        }else{
                            console.log("mail sent")
                        }
                    })
                    return res.status(200).json({message:"Account is Not Active, Activation Link sent to mail"})
                }
            }else{
                return res.status(200).json({message:"Invalid Password"})
            }  
        }
}catch (error) {
        console.log(error)
        res.status(500).json({message:"Login User Failed"})
    }
})

//forgot password
router.post("/forgot",async(req,res)=>{

    try {
        //checking user email is registered or not
        const findUser=await findingUser(req.body.email);

        if(findUser.length<1){
            return res.status(400).json({message:"Invalid Email address"})
        }else{
            //creating expiry token
            const token=await generateExpiryToken(findUser[0]._id);

            //adding token to the database
            const setToken=await forgotToken(findUser[0]._id,token);

             //sending mail to reset password
             const link=`https://capstone-project-task.netlify.app/reset/${findUser[0]._id}`

             //composing mail
             const composingMail={
                 from:process.env.Email,
                 to:findUser[0].email,
                 subject:"Password Reset Link",
                 html:`<a href=${link}>${link}</a>`
             }

             //creating transport to send mail
             transport.sendMail(composingMail,(error,info)=>{
                 if(error){
                     console.log(error)
                 }else{
                     console.log("mail sent")
                 }
             })
             return res.status(200).json({message:"Reset Link sent to mail"});
        }
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Error forgot Password"})
    }
})

//reset password
router.post("/reset/:id",async(req,res)=>{

    try {
          //finding user
          const getUser=await findUser(req.params.id);

          //verifying token
          const verify=jwt.verify(getUser[0].token,process.env.SECRET_KEY);

          //encrypting user password
          const salt=await bcrypt.genSalt(10);

          const hashedPassword=await bcrypt.hash(req.body.password,salt);

          //updating password
          const updating=await updatingPassword(getUser[0]._id,hashedPassword);

          return res.status(200).json({message:"Password Reset Successfull"});
        }
   catch (error) {
        console.log(error)
        res.status(500).json({message:"Reset Link Expired"})
    }
})

//adding tasks 
router.post("/createTasks",isAuthorized,async(req,res)=>{

    try {
            //creating object of data details
            const data={
                title:req.body.title,
                content:req.body.content,
                createdOn:new Date().toDateString(),
            }
            //adding task to database
            const addingData=await addTask(data);
 
            return res.status(200).json({message:addingData})
        
    } catch (error) {
        console.log("Error adding Url",error);
        res.status(500).json({error:"Error adding Url"})
    }
})

//editing tasks
router.put("/updateTasks/:id",isAuthorized,async(req,res)=>{

    try {
            const data={
                title:req.body.title,
                content:req.body.content,
                createdOn:new Date().toDateString(),
            }
            const id = req.params.id
            //adding tasks to database
            const addingData=await editingTask(data, id);
          
            return res.status(200).json({message:addingData})

    } catch (error) {
        console.log("Error adding Url",error);
        res.status(500).json({error:"Error adding Url"})
    }
})

//deleting tasks 
router.delete("/deleteTasks/:id",isAuthorized,async(req,res)=>{

    try {
            const id = req.params.id
            //adding id to database
            const addingData=await deletingTask(id);
          
            return res.status(200).json({message:addingData})

    } catch (error) {
        console.log("Error adding Url",error);
        res.status(500).json({error:"Error adding Url"})
    }
})

//update the status
router.put("/updateStatus/:id",isAuthorized,async(req,res)=>{

    try {
            const data={
                title:req.body.title,
                content:req.body.content,
                isCompleted: req.body.isCompleted,
                createdOn:new Date().toDateString(),
            }
            const id = req.params.id
        
            //adding status to database
            const addingData=await editingStatus(data, id);
          
            return res.status(200).json({message:addingData})

    } catch (error) {
        console.log("Error adding Url",error);
        res.status(500).json({error:"Error adding Url"})
    }
})

//find all tasks
router.get("/getAllTasks",isAuthorized,async(req,res)=>{

    try {
        //finding all tasks
        const findTask=await allTasks();
        res.status(200).json({message:findTask}); 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error getting all urls"})
    }
})

//find completed tasks
router.get("/getCompletedtask",isAuthorized,async(req,res)=>{

    try {
        //finding completed tasks
        const findTask=await completedTask();
        res.status(200).json({message:findTask}); 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error getting all urls"})
    }
})

//find not completed tasks
router.get("/getNotCompletedTask",isAuthorized,async(req,res)=>{

    try {
        //finding not completed tasks
        const findTask=await NotCompltedTask();
        res.status(200).json({message:findTask}); 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error getting all urls"})
    }
})


//exporting router
export const Router=router;