const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @route POST /api/user/login
 * @desc Логин
 * @access Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, заполните обязательные поля' });
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        const isPasswordCorrect =
            user && (await bcrypt.compare(password, user.password));

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message:
                    'Произошла ошибка на сервере. Пожалуйста, попробуйте позже.',
            });
        }

        if (user && isPasswordCorrect) {
            res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
            });
        } else {
            return res
                .status(401)
                .json({ message: 'Неверно введен логин или пароль' });
        }
    } catch {
        return res.status(500).json({
            message: 'Произошла серверная ошибка. Попробуйте позже.',
        });
    }
};

/**
 * @route POST /api/user/register
 * @desc Регистрация
 * @access Public
 */
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                message: 'Пожалуйста, заполните обязательные поля',
            });
        }

        const registeredUser = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (registeredUser) {
            return res.status(409).json({
                message: 'Пользователь с указанными email уже существует',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message:
                    'Произошла ошибка на сервере. Пожалуйста, попробуйте позже.',
            });
        }

        if (user) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
                name,
            });
        } else {
            return res.status(500).json({
                message: 'Не удалось создать пользователя',
            });
        }
    } catch {
        return res.status(500).json({
            message: 'Произошла серверная ошибка. Попробуйте позже.',
        });
    }
};

/**
 * @route GET /api/user/current
 * @desc Текущий пользователь
 * @access Private
 */
const current = (req, res) => {
    res.send('current');
};

module.exports = {
    login,
    register,
    current,
};
