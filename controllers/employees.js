const { prisma } = require('./../prisma/prisma-client');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        return res.status(200).json(employees);
    } catch {
        return res.status(500).json({
            message: 'Произошла ошибка при запросе списка сотрудников',
        });
    }
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

        const employee = await prisma.employee.create({
            data: { firstName, lastName, age, address, userId },
        });

        return res.status(201).json(employee);
    } catch (err) {
        return res.status(500).json({
            message: 'Произошла ошибка при создании сотрудника',
        });
    }
};

const getEmployeeById = async (req, res) => {
    const id = req.params.id;

    try {
        const employee = await prisma.employee.findFirst({
            where: {
                id,
            },
        });

        if (!employee) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }

        return res.status(200).json(employee);
    } catch {
        return res.status(500).json({
            message:
                'Не удалось получить информацию о сотруднике, попробуйте позже.',
        });
    }
};

const editEmployeeById = async (req, res) => {
    try {
        const { firstName, lastName, age, address } = req.body;
        const id = req.params.id;
        const { id: userId } = req.user;

        if (!firstName || !lastName || !age || !address) {
            return res.status(400).json({
                message: 'Пожалуйста, заполните обязательные поля',
            });
        }

        const employee = await prisma.employee.findFirst({
            where: {
                id,
            },
        });

        if (!employee) {
            return res
                .status(404)
                .json({ message: 'Не удалось найти сотрудника.' });
        }

        if (userId !== employee.userId) {
            return res.status(403).json({
                message: 'Недостаточно прав для выполнения операции',
            });
        }

        const updatedEmployee = await prisma.employee.update({
            where: {
                id,
            },
            data: { firstName, lastName, age, address, userId },
        });

        return res.status(200).json(updatedEmployee);
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось отредактировать сотрудника',
        });
    }
};

const deleteEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const employee = await prisma.employee.findFirst({
            where: {
                id,
            },
        });

        if (!employee) {
            return res
                .status(404)
                .json({ message: 'Не удалось найти сотрудника.' });
        }

        if (userId !== employee.userId) {
            return res.status(403).json({
                message: 'Недостаточно прав для выполнения операции',
            });
        }

        await prisma.employee.delete({
            where: {
                id,
            },
        });

        res.status(200).json({
            message: `delete employee id ${req.params.id}`,
        });
    } catch {
        return res.status(500).json({
            message: 'Не удалось удалить сотрудника, попробуйте позже.',
        });
    }
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    editEmployeeById,
    deleteEmployeeById,
};
