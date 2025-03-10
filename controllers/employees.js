const { prisma } = require('./../prisma/prisma-client');

const getAllEmployees = async (req, res) => {
    res.status(200).json({ message: 'get all employees' });
};

const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, age, address } = req.body;
        const { id: userId } = req.user;

        if (!firstName || !lastName || !age || !address) {
            return res.status(400).json({
                message: 'Пожалуйста, заполните обязательные поля',
            });
        }

        await prisma.employee.create({
            data: { firstName, lastName, age, address, userId },
        });

        return res.status(201).json({ message: 'Сотрудник создан' });
    } catch (err) {
        return res.status(500).json({
            message: 'Произошла ошибка при создании сотрудника',
        });
    }
};

const getEmployeeById = async (req, res) => {
    res.status(200).json({ message: `get employees id ${req.params.id}` });
};

const editEmployeeById = async (req, res) => {
    res.status(200).json({ message: `change employee id ${req.params.id}` });
};

const deleteEmployeeById = async (req, res) => {
    res.status(200).json({ message: `delete employee id ${req.params.id}` });
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    editEmployeeById,
    deleteEmployeeById,
};
