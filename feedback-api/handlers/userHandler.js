const connectToDatabase = require('../db');
const {parseData, validateSetOfFields, sendErrorResponse} = require('../helpers/validation');
require('dotenv').config({path: '../.env'});
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));

module.exports.signup = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        data.id = uuidv4();
        const validationItems = [
            {value: data.name, fieldname: "name", rules: ['validateRequired']},
            {value: data.email, fieldname: "email", rules: ['validateRequired', 'validateEmail']},
            {value: data.password, fieldname: "password", rules: ['validateRequired', 'validatePassword']},
        ];

        validateSetOfFields(validationItems);

        await connectToDatabase();
        const searchValue = new RegExp(data.email, 'i');
        const searchUser = await User.findOne({'email': { $regex: searchValue }}).exec();
        if (searchUser) {
            return callback(null, sendErrorResponse({
                statusCode: 400,
                message: "User already exists"
            }))
        }
        const passwordHash = bcrypt.hashSync(data.password, salt);
        await User.create({
            ...data,
            password: passwordHash
        });
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                ...data, password: ""
            })
        });
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
};

module.exports.login = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        const validationItems = [
            {value: data.email, fieldname: "email", rules: ['validateRequired']},
            {value: data.password, fieldname: "password", rules: ['validateRequired']},
        ];

        validateSetOfFields(validationItems);

        await connectToDatabase();
        const searchUser = await User.findOne({'email': data.email}).exec();
        if (searchUser) {
            const passwordsEqual = bcrypt.compareSync(data.password, searchUser.password);
            if (passwordsEqual) {
                const token = jwt.sign(
                    {id: searchUser.id, email: searchUser.email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        id: searchUser.id,
                        token
                    })
                })
            } else {
                return callback(null, sendErrorResponse({
                    statusCode: 400,
                    message: "Invalid user data"
                }));
            }
        }
        return callback(null, sendErrorResponse({
            statusCode: 404,
            message: "User not found"
        }));
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
};
