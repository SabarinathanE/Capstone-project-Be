import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./dbConfig.js";
import { Router } from "./Routes/route.js";

//configuring dotenv
dotenv.config();

//initializing port
const PORT=process.env.PORT;
const HOST=process.env.HOST;

//initializing server
const app=express();

//middlewares
app.use(express.json());

app.use(cors());

//connecting database
dbConnect();

//adding router
app.use("/",Router);

//listening to the server
app.listen(PORT, HOST,()=>console.log("Server started"));