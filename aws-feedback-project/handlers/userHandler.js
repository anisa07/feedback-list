const express = require("express");
const AWS = require("aws-sdk");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {dynamoDbClient} = require("../dbClient");

const USERS_TABLE = process.env.USERS_TABLE;
const userRouter = express.Router();
const v4 = AWS.util.uuid.v4;

function generateAccessToken(username) {
    // expires in hour
    return jwt.sign({data: username}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

const searchParamsByEmail = (email) => {
    return {
        TableName: USERS_TABLE,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email",
        },
        ExpressionAttributeValues: { ":email": email }
    };
}

const validateDataField = (field, name, res) => {
    if (!field || !field.trim()) {
        res.status(400).json({error: `${name} required!`});
        return;
    }
}

userRouter.get("/:userId", async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            id: req.params.userId,
        },
    };

    console.log(process.env)

    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
            const { id, name, email, img } = Item;
            res.json({ id, name, email, img });
        } else {
            res
                .status(404)
                .json({ error: 'Could not find user with provided id' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
    }
});

userRouter.post("/login", async function (req, res) {
    const {email, password} = req.body;
    validateDataField(email, 'Email', res);
    validateDataField(password, 'Password', res);

    try {
        const {Items} = await dynamoDbClient.scan(searchParamsByEmail(email)).promise();
        if (Items.length) {
            const {password: passwordHash, id, name} = Items[0];
            const match = bcrypt.compareSync(password, passwordHash);
            if (match) {
                const token = generateAccessToken(name);
                return res.json({id, token});
            }
        }
        res.status(400).json({error: "Invalid password or email. Access denied!"});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Server error!"});
    }
});

userRouter.post("/signup", async function (req, res) {
    const {name, email, img, password} = req.body;
    validateDataField(email, 'Email', res);
    validateDataField(password, 'Password', res);
    validateDataField(name, 'Name', res);

    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    const id = v4();

    try {
        const {Items} = await dynamoDbClient.scan(searchParamsByEmail(email)).promise();
        if (Items.length) {
            res.status(409).json({error: "User with such email already exist"});
            return;
        }
        const params = {
            TableName: USERS_TABLE,
            Item: {
                id,
                name,
                email,
                img,
                password: hash,
            },
        };
        await dynamoDbClient.put(params).promise();
        res.json({ id });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Server error!"});
    }
});

module.exports = {
    userRouter,
    validateDataField
};
