// models/employee.js

const mongoose = require('mongoose');

// Define the schema for the employee collection
const employeeSchema = new mongoose.Schema({
    firstName: String,   // Add more attributes if needed
    lastName: String,
    department: String,
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Export the Employee model
module.exports = Employee;
