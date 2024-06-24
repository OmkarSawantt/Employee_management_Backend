const express = require('express');
const mongoose = require('mongoose');
const Employee = require('./models/employee');
const Department = require('./models/department');

const app = express();


// Connect to MongoDB
mongoose.connect('mongodb+srv://omkar981952:XjcGwsaYlGGrFOF5@cluster1.zzkwt0z.mongodb.net/Employee_management?retryWrites=true&w=majority&appName=Cluster1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//department 
//create department
app.post('/department', async (req, res) => {
    try {
        const { name } = req.body;
        const newDepartment= new Department({name});
        await newDepartment.save()
        res.json(newDepartment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create an Department.' });
    }
});
//get all department
app.get('/department', async (req, res) => {
    try {
        const department = await Department.find();
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve department.' });
    }
});
//get single department
app.get('/department/:id',async (req,res)=>{
    try {
        const depId = req.params.id; 
        const department = await Department.findById(depId); 
        if (!department) {
            return res.status(404).json({ error: 'Department not found' }); // Handle case where employee is not found
        }
        res.json(department)
    } catch (error) {
        res.status(500).json({error:'Failed to retrieve Department'})
    }
})
//employee
//create new employee data
app.post('/employees', async (req, res) => {
    try {
        const { firstName, lastName, department } = req.body;
        const currentDep=await Department.findOne({ name: department });
        if (!currentDep) {
            return res.status(404).json({ error: 'Department not found' });
        }

        currentDep.employees += 1;
        await currentDep.save();
        const newEmployee = new Employee({ firstName, lastName, department:currentDep._id });
        await newEmployee.save();
        res.json(newEmployee);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});
//get all employee details
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employees.' });
    }
});
//get single employee detail
app.get('/employees/:id',async (req,res)=>{
    try {
        const employeeId = req.params.id; 
        const employee = await Employee.findById(employeeId); 
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' }); // Handle case where employee is not found
        }
        res.json(employee)
    } catch (error) {
        res.status(500).json({error:'Failed to retrieve employee'})
    }
})
//get employees of one department
app.get('/employees/department/:id',async (req,res)=>{
    try {
        const depId=req.params.id;
        const employee=await Employee.find({department:depId});
        res.json(employee)
    } catch (error) {
        res.status(500).json({error:'Failed to retrieve employees'})
    }
})
//edit employee detail
app.patch('/employees/:id',async (req,res)=>{
    try {
        const empId=req.params.id;
        const { firstName, lastName, department } = req.body;
        const prevEmpDetail=await Employee.findById(empId);
        const prevDep=await Department.findById(prevEmpDetail.department)
        prevDep.employees -= 1;
        await prevDep.save();
        const currentDep=await Department.findOne({ name: department });
        if (!currentDep) {
            return res.status(404).json({ error: 'Department not found' });
        }
        currentDep.employees += 1;
        await currentDep.save();
        const updatedEmp=await Employee.findByIdAndUpdate(empId,{firstName,lastName,department:currentDep._id},{new:true});
        await updatedEmp.save();
        res.json(updatedEmp);
    } catch (error) {
        res.status(500).json({error:'Failed to edit Employee details'});
    }
})
//delete employee detail
app.delete('/employees/:id',async (req,res)=>{
    try {
        const empId=req.params.id;
        const empDetail=await Employee.findById(empId);
        const dep=await Department.findById(empDetail.department)
        dep.employees -= 1;
        await dep.save();
        await Employee.findByIdAndDelete(empId);
        res.status(200).json("Done")
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Failed to delete Employee details'});
    }
})
const port =  3020;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
