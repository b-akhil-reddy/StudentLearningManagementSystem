const crypto = require('crypto');
const secureRandom = require('secure-random')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { users } = require('../models/users');
const signupUser = async (req, res) => {
    const { userName, firstName, mobile, lastName, initial, password, userType, email } = req.body
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(password,salt,100,64,'sha512').toString('hex')
    try {
        var errors={}
        var counter=0
        if(await users.findOne({"userName":userName})!=null){
            errors["userName"]="Username already taken by another user"
            counter++
        }
        if(await users.findOne({"email":email})!=null){
            errors["email"]="Email already used by another user"
            counter++
        }
        if(await users.findOne({"mobile":mobile})!=null){
            errors["mobile"]="Mobile number already used by another user"
            counter++
        }
        if(counter==0){
            const newUser = await new users({
                "userName": userName,
                "firstName": firstName,
                "lastName": lastName,
                "initial": initial,
                "password": hashedPassword,
                "userType": userType,
                "email": email,
                "mobile": mobile,
                "salt": salt
            })
            await newUser.save()
            res.send({'success': 'Successfully registered'})
        }else if(counter>0){
            res.send({"error": errors})
        }
    } catch (error) {
        res.send({"error":"Error at the server side please come back later"})
    }
}

function generateRandomPassword(){
    characters="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    special_characters=" !#\$%&()*+,-./:;<=>?@[]^_{|}~";
    rand_pass="";
    var buf = new Uint8Array(1);
    for (i = 0;i < 4;i++){
        buf=secureRandom.randomUint8Array(1);
        rand_pass += characters[buf[0]%characters.length];
    }
    for (i = 0; i < 2;i++){
        buf=secureRandom.randomUint8Array(1);
        rand_pass += special_characters[buf[0]%special_characters.length];
    }
    for (i = 0; i < 4;i++){
        buf=secureRandom.randomUint8Array(1);
        rand_pass += characters[buf[0]%characters.length];
    }
    return rand_pass;
}

const resetPassword = async (req, res) => {
    const {userName,email,mobile} = req.body;
    try {
        if(userName==undefined||email==undefined||mobile==undefined||userName==''||email==''||mobile==''){
            res.send({error:"Username, Email and Mobile cannot be empty"})
        }else{
            data=await users.findOne({ "userName": userName, "email": email, "mobile": mobile })
            password=generateRandomPassword()
            const hashedPassword = crypto.pbkdf2Sync(password,data!=undefined?data.salt:"",100,64,'sha512').toString('hex')
            if(data!=undefined){
                await users.updateOne({ "userName": userName, "email":email, "mobile": mobile },{$set:{password:hashedPassword}})
                res.send({success:"Password Reset successfull",password:password})
            }else{
                res.send({error:"Invalid Username or Email or Mobile Number"})
            }
        }
    } catch (error) {
        console.log(error)
        res.send({"error":"Error at the server try again later"})
    }
}

const changePassword = async (req, res) => {
    const {userName,password,newpassword} = req.body;
    try {
        if(userName==undefined||password==undefined||newpassword==undefined||userName==''||password==''||newpassword==''){
            res.send({error:"Username, Password and New Password cannot be empty"})
        }else{
            data=await users.findOne({ "userName": userName})
            const hashedPassword = crypto.pbkdf2Sync(password,data!=undefined?data.salt:"",100,64,'sha512').toString('hex')
            const newHashedPassword = crypto.pbkdf2Sync(newpassword,data!=undefined?data.salt:"",100,64,'sha512').toString('hex')
            if(password,newpassword){
                res.send({error:"New password cannot be same as the old password."})
            }else if(data!=undefined&&data.password==hashedPassword){
                await users.updateOne({ "userName": userName, "password":hashedPassword},{$set:{password:newHashedPassword}})
                res.send({success:"Password Changed Successfully."})
            }else{
                res.send({error:"Invalid username or password."})
            }
        }
    } catch (error) {
        console.log(error)
        res.send({"error":"Error at the server try again later"})
    }
}

const signinUser = async (req, res) => {
    const {userName,password} = req.body;
    try {
        if(userName==undefined||password==undefined||userName==''||password==''){
            res.send({error:"Username and Password cannot be empty"})
        }else{
            if(req.cookies["token"]==null){
                data=await users.findOne({ "userName": userName})
                const hashedPassword = crypto.pbkdf2Sync(password,data!=undefined?data.salt:"",100,64,'sha512').toString('hex')
                if(data!=undefined&&data.password==hashedPassword){
                    const token=jwt.sign({data},process.env.AT_SECRET)
                    req.flash("success","Logged in Successfully")
                    res.cookie('token', token).send({success:"Logged in Successfully",redirect:"/"});
                }else{
                    res.send({error:"Invalid username or password"})
                }
            }else if(req.cookies["token"]!=null){
                jwt.verify(req.cookies["token"],process.env.AT_SECRET,(err,data)=>{
                    if(err){
                        req.flash("error","Cookies on your browser are invalid")
                        res.send({error:"Cookies on your browser are invalid"})
                    }
                    res.send({success:"Already Logged In",redirect:"/"})
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.send({"error":"Error at the server try again later"})
    }
}

const signoutUser = async (req, res) => {
    const user = req.user;
    try {
        if(req.cookies["token"]!=null&&req.user){
            req.flash("success","Successfully logged out")
            res.clearCookie("token").redirect("/login");
        }else{
            req.flash("error","You need to login first")
            res.clearCookie("token").redirect("/login");
        }
    } catch (error) {
        console.log(error)
        req.flash("error","Cannot log out")
        res.clearCookie("token").redirect("/login");
    }
}

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '300s' })
}

const verifyAccessToken = (req, res, next)=>{
    if(req.cookies["token"]!=null){
        jwt.verify(req.cookies["token"],process.env.AT_SECRET,(err,data)=>{
            if(err){
                req.flash("error","Cookies on your browser are invalid")
                res.clearCookie("token").redirect("/login");
            }else{
                delete data["data"]["password"]
                delete data["data"]["_id"]
                delete data["data"]["__v"]
                delete data["data"]["salt"]
                req.user=data["data"]
                next()
            }
        })
    }else{
        res.clearCookie("token");
        next();
    }
}

module.exports={
    signinUser,
    signoutUser,
    signupUser,
    verifyAccessToken,
    resetPassword,
    changePassword
}