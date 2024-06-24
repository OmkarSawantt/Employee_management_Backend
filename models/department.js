// models/department.js

const mongoose = require('mongoose');

// Define the schema for the department collection
const departmentSchema = new mongoose.Schema({
    name:{type:String}, 
    employees:{type:Number,default:0}
});

// Create the Department model
const Department = mongoose.model('Department', departmentSchema);

// Export the Department model
module.exports = Department;
