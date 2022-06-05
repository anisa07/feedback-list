const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;

const sendErrorResponse = (err) => (
    {
        statusCode: err.statusCode || 500,
        headers: {
            'Content-Type': 'text/plain',
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            }},
        body: err.message
    }
)

const validateRequired = (value, fieldName) => {
    if (!value || !value.trim()) {
        return sendErrorResponse({
            statusCode: 400,
            message: fieldName + " required"
        })
    }
};

const validateEmail = (value) => {
    const result = value.match(emailRegex);
    if (!result) {
        return sendErrorResponse({
            statusCode: 400,
            message: "Invalid email"
        })
    }
};

const validatePassword = (value) => {
    const result = value.match(pwdRegex);
    if (!result) {
        return sendErrorResponse({
            statusCode: 400,
            message: "Invalid password"
        })
    }
};

module.exports.parseData = (data) => {
    try {
        return JSON.parse(data)
    } catch (e) {
        throw sendErrorResponse({statusCode: e.statusCode || 400, message: 'Could not parse data'})
    }
}

const validate = (obj) => {
    const {value, fieldname, rules} = obj;
    let result = undefined;
    for (let ruleName of rules) {
        if (result) {
            return result;
        }
        if (ruleName === 'validateRequired') {
            result = validateRequired(value, fieldname)
        }
        if (ruleName === 'validateEmail') {
            result = validateEmail(value)
        }
        if (ruleName === 'validatePassword') {
            result = validatePassword(value)
        }
    }
    return result;
}

const validateSetOfFields = (validationItems) => {
    for (let item of validationItems) {
        const result = validate(item);
        if (result) {
            throw result
        }
    }
}

module.exports.sendErrorResponse = sendErrorResponse;
module.exports.validateSetOfFields = validateSetOfFields;
