// models/department.js

const mongoose = require('mongoose');

// Define the schema for the department collection
const departmentSchema = new mongoose.Schema({
    name: String,   // You can add more attributes here
});

// Create the Department model
const Department = mongoose.model('Department', departmentSchema);

// Export the Department model
module.exports = Department;
