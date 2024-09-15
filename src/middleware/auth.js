const jwt = require("jsonwebtoken");
const teacherSchema = require("../models/model2.js");

const auth = async (req, res, next)=>{
    try{
        const token = req.cookies.JWT;
        if(token == null || token == undefined) res.render("home.hbs");
        else{
            const verifyUser = await jwt.verify(token, "asdfghjklqwertyuiopzxcvbnmasdfghjkl");
            const teacherData = await teacherSchema.findOne({_id:verifyUser._id});
            (teacherData != undefined || teacherData != null)? res.render("index.hbs", {data:teacherData}): res.render("home.hbs");
            req.token = token;
            req.teacherData = teacherData;
            next();
        }
    }catch(error){
        console.log(`Error occured while authentication ${error}`);
        res.render("home.hbs");
    }
};
module.exports = auth;