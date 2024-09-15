require('dotenv').config();
const express = require('express');
//const mongoose = require("mongoose");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const hbs = require("hbs");
const cors = require("cors");
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({server:server});
const PORT = process.env.port || 3000;
require("./db/connection");
const auth = require("./middleware/auth");
const partialsPath = path.join(__dirname, "../template/partials");
const StudentModel = require("./models/model");
const TeacherModel = require("./models/model2");
const cookieParser = require('cookie-parser');
const bcrypt = require ('bcryptjs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "hbs");
app.set("views", "./template/views");
hbs.registerPartials(partialsPath);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use(expressSession({
    secret: "asdfghjklqwertyuiopzxcvbnmasdfghjkl",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 30 
    }
}));

app.get("/", auth, (req, res)=>{
    res.render("home.hbs");
});
app.get("/firstYear", (req, res)=>{
    (req.session.isLogin)? res.render("fAttendance.hbs") : res.redirect("/");
});

app.post("/login", async (req, res)=>{
    var errorObj = {userError:false, passwordError:false};
    try{
        const userID = req.body.emailName;
        const password = req.body.password;
        console.log(`Entered Email = ${userID}`);
        const data = await TeacherModel.findOne({userID:userID});
        if(data == undefined || data == null) {
            errorObj.userError = true;
            throw new Error("User doesnt's exists");
        }
        const isMatch = await bcrypt.compare(password, data.password);
        console.log("Passowrd match status "+isMatch);
        if(isMatch){
            req.session.isLogin = true;
            req.session.user = data;
            const token = await data.authToken();
            res.cookie("JWT", token);
            res.redirect("/home");
        }else{
            errorObj.passwordError = true;
            throw new Error("Password not match");
        }
    }catch(err){
        console.log(`Error occured while login ${err}`);
        if(errorObj.userError) res.status(404).send("User doesn't exists");
        else if(errorObj.passwordError) res.status(401).send("Password incorrect");
        else res.status(505).send("Internal server Error");

    }
});

app.get("/home", async (req, res)=>{
    if (req.session.isLogin) {
        res.render("index.hbs", { data: req.session.user });
    } else {
        res.redirect("/");
    }
});

app.post("/tregister", async (req, res)=>{
    try {
        const result = new TeacherModel({
            name:req.body.name,
            userID:req.body.userID,
            password:req.body.password,
            confirmPassword: req.body.confirmPassword,
            branch: req.body.branch,
            mobileNo: req.body.mobileNo,
            emailID: req.body.emailID
        });
        const token = await result.authToken();
        res.cookie("JWT", token);
        const data = await result.save();
        console.log(`Data saved: ${data}`);
    } catch (error) {
        console.log(`Error occured while saving the teacher record ${error}`);
    }
});

wss.on('connection', (client, req)=>{
    const clientIP = req.connection.remoteAddress;
    console.log(`A client connected with IP address ${clientIP}`);
    client.on("message", (message)=>{
        console.log("RollNumber received %s", message);
        async function readData(uid){
            try{
                const result = await StudentModel.find({uid:uid}, {_id:0,name:1, rollNumber:1});
                console.log(result);
                client.send(JSON.stringify(result));
                clientSet.forEach(cl=>{
                    if(cl !== client && cl.readyState === WebSocket.OPEN){
                        cl.send(JSON.stringify(result));
                    }
                })

                console.log(typeof JSON.stringify(result));

            }catch(err){
                console.log(`Error occured while reading data from database ${err}`);
            }
        }
        readData(Number(message.toString()));
    });
});

server.listen(PORT, ()=>{
    console.log(`Server is started at port ${PORT}`);
});