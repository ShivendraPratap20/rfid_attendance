const mong = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherSchema = new mong.Schema({
    name:               {type:String, required:true},
    userID:             {type:String, required:true},
    password:           {type:String, required: true},
    confirmPassword:    {type:String, required:false},
    branch:             {type:String},
    mobileNo:           {type:Number},
    emailID:            {type:String, required:false},
    tokens:[{
        token:{
            type: String, required:false
        }
    }]
});


teacherSchema.methods.authToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        console.log(`Token saved`);
        return token;
    }catch(err){
        console.log(`Error occured while saving the token ${err}`);
    }
}

teacherSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
    }
    next();
});


const TeacherModel = new mong.model("Collection2", teacherSchema);

module.exports = TeacherModel;