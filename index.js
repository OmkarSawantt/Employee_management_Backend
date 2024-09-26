const express = require('express');
const mongoose = require('mongoose');
const Employee = require('./models/employee');
const Department = require('./models/department');
const { swaggerUi, swaggerSpec } = require('./swagger'); // Import Swagger
var cors = require('cors')
const app = express();
app.use(cors())
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Department Routes
/**
 * @swagger
 * /department:
 *   post:
 *     summary: Create a new department
 *     description: Adds a new department to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department created successfully.
 *       500:
 *         description: Failed to create a department.
 */
app.post('/department', async (req, res) => {
    try {
        const { name } = req.body;
        const newDepartment = new Department({ name });
        await newDepartment.save();
        res.json(newDepartment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a Department.' });
    }
});

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Get all departments
 *     description: Retrieves a list of all departments.
 *     responses:
 *       200:
 *         description: A list of departments.
 *       500:
 *         description: Failed to retrieve departments.
 */
app.get('/department', async (req, res) => {
    try {
        const department = await Department.find();
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve department.' });
    }
});

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Get a single department by ID
 *     description: Retrieves a specific department by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the department to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A department object.
 *       404:
 *         description: Department not found.
 *       500:
 *         description: Failed to retrieve Department.
 */
app.get('/department/:id', async (req, res) => {
    try {
        const depId = req.params.id;
        const department = await Department.findById(depId);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve Department' });
    }
});

// Employee Routes
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     description: Adds a new employee to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee created successfully.
 *       404:
 *         description: Department not found.
 *       500:
 *         description: Failed to create an employee.
 */
app.post('/employees', async (req, res) => {
    try {
        const { firstName, lastName, department } = req.body;
        const currentDep = await Department.findOne({ name: department });
        if (!currentDep) {
            return res.status(404).json({ error: 'Department not found' });
        }

        currentDep.employees += 1;
        await currentDep.save();
        const newEmployee = new Employee({ firstName, lastName, department: currentDep._id });
        await newEmployee.save();
        res.json(newEmployee);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     description: Retrieves a list of all employees.
 *     responses:
 *       200:
 *         description: A list of employees.
 *       500:
 *         description: Failed to retrieve employees.
 */
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employees.' });
    }
});

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     description: Retrieves a specific employee by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the employee to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An employee object.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Failed to retrieve employee.
 */
app.get('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employee' });
    }
});

/**
 * @swagger
 * /employees/department/{id}:
 *   get:
 *     summary: Get employees of a specific department
 *     description: Retrieves employees belonging to a specific department by department ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the department to get employees from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of employees from the specified department.
 *       500:
 *         description: Failed to retrieve employees.
 */
app.get('/employees/department/:id', async (req, res) => {
    try {
        const depId = req.params.id;
        const employee = await Employee.find({ department: depId });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employees' });
    }
});

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Edit an employee's details
 *     description: Updates the details of a specific employee by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the employee to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee details updated successfully.
 *       404:
 *         description: Employee or Department not found.
 *       500:
 *         description: Failed to edit Employee details.
 */
app.patch('/employees/:id', async (req, res) => {
    try {
        const empId = req.params.id;
        const { firstName, lastName, department } = req.body;
        const prevEmpDetail = await Employee.findById(empId);
        const prevDep = await Department.findById(prevEmpDetail.department);
        prevDep.employees -= 1;
        await prevDep.save();

        const currentDep = await Department.findOne({ name: department });
        if (!currentDep) {
            return res.status(404).json({ error: 'Department not found' });
        }
        currentDep.employees += 1;
        await currentDep.save();

        const updatedEmp = await Employee.findByIdAndUpdate(empId, { firstName, lastName, department: currentDep._id }, { new: true });
        await updatedEmp.save();
        res.json(updatedEmp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit Employee details' });
    }
});

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     description: Deletes a specific employee by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the employee to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Failed to delete employee.
 */
app.delete('/employees/:id', async (req, res) => {
    try {
        const empId = req.params.id;
        const empToDel = await Employee.findById(empId);
        const depId = empToDel.department;

        const dep = await Department.findById(depId);
        dep.employees -= 1;
        await dep.save();

        await Employee.findByIdAndDelete(empId);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
