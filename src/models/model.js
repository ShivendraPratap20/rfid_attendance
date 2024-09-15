const mong = require('mongoose');

const studentSchema = new mong.Schema({
    name:{type: String, required: true},
    rollNumber : {type: Number, required: true, unique: true},
    branch : {type: String, required: true},
    course: {type: String, require: true},
    semester: {type: Number, required: true},
    year: {type: Number, required: true},
    uid:{type:Number, required:true}
});

const StudentModel = new mong.model("Collection1", studentSchema);

module.exports = StudentModel;