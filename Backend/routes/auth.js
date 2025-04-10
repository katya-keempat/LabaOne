const express = require("express");
require("dotenv").config;
const CORS = require("cors");
const http =  require("http");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {User} = require('../config/db');

const router = express.Router();

router.post("/", async (req,res)=>{
    const {email,name,password} = req.body;

    if(!email || !name || !password){
        return res.status(400).json({message:"Заполните все поля!"});
    }

    try{
        const existingUser = await User.findOne();
        if(existingUser){ return res.status(400).json({message:"Email существует!"});}
        else{const user = await User.create({email, name,password});
        return res.status(201).json({message:"Регистрация прошла успешно!"});}

    } catch(error){
        res.status(500).json({message:"Ошибка сервера!"});

    }


})

module.exports.auth_router = router;