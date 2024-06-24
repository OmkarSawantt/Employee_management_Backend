// models/employee.js

const mongoose = require('mongoose');

// Define the schema for the employee collection
const employeeSchema = new mongoose.Schema({
    firstName: {type:String},   
    lastName:{type:String},
    department:{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Export the Employee model
module.exports = Employee;
