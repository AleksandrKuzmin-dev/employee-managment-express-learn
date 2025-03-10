const express = require('express');
const router = express.Router();
const { auth } = require('./../middleware/auth');
const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    editEmployeeById,
    deleteEmployeeById,
} = require('./../controllers/employees');

router.get('/', auth, getAllEmployees);

router.post('/', auth, createEmployee);

router.get('/:id', auth, getEmployeeById);

router.put('/:id', auth, editEmployeeById);

router.delete('/:id', auth, deleteEmployeeById);

module.exports = router;
