const connectToDatabase = require('../db');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');
const Type = require('../models/Type');
const Status = require('../models/Status');
const User = require('../models/User');
const {parseData, validateSetOfFields, sendErrorResponse} = require("../helpers/validation");
const {v4: uuidv4} = require("uuid");
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../.env'});

const getStatusByParam = async (params) => {
    const status = await Status.findOne(params).exec();
    return status;
}

const getStatuses = async () => {
    const statuses = await Status.find().exec();
    return statuses ? statuses.map(status => status['_doc']) : []
}

const getFeedbacks = async () => {
    const feedbacks = await Feedback.find().exec();
    return feedbacks ? feedbacks.map(feedback => feedback['_doc']) : [];
}

const getFeedbacksByType = async (params) => {
    const feedbacks = await Feedback.find(params).exec();
    return feedbacks ? feedbacks.map(feedback => feedback['_doc']) : [];
}

const getComments = async () => {
    const comments = await Comment.find().exec();
    return comments ? comments.map(comment => comment['_doc']) : [];
}

const getUserById = async (id) => {
    const user = await User.findOne({'id': id}).exec();
    return user ? user['_doc'] : {};
}

const getTypeByParam = async (param) => {
    const type = await Type.findOne(param).exec();
    return type ? type['_doc'] : null;
}

const getFeedbackById = async (id) => {
    const feedback = await Feedback.findOne({'id': id}).exec();
    return feedback ? feedback['_doc'] : null;
}

const getTypes = async () => {
    const types = await Type.find().exec();
    return types ? types.map(comment => comment['_doc']) : [];
}

const checkToken = async (eventHeaders) => {
    if (eventHeaders.userId && eventHeaders.token) {
        const user = await getUserById(eventHeaders.userId);
        if (user) {
            try {
                const decoded = jwt.verify(eventHeaders.token, process.env.TOKEN_KEY);
                if (decoded.id === user.id && decoded.email === user.email && Date.now() <= decoded.exp * 1000) return;
                throw sendErrorResponse({
                    statusCode: 403,
                    message: 'Not authorised'
                });
            } catch(err) {
                throw sendErrorResponse({
                    statusCode: 403,
                    message: 'Not authorised'
                });
            }
        }
        throw sendErrorResponse({
            statusCode: 404,
            message: 'User not found'
        });
    }
    throw sendErrorResponse({
        statusCode: 404,
        message: 'User or token not found'
    });
}

const fillFeedback = async (item) => {
    const comments = await getComments();
    const feedbackAuthor = await getUserById(item.authorId);
    const type = await getTypeByParam({'id': item.typeId});
    const status = await getStatusByParam({'id': item.statusId});
    const commentsUpdated = []
    const commentsPerFeedback = comments.filter((comment) => comment.feedbackId === item.id);

    for (let comment of commentsPerFeedback) {
        const commentAuthor = await getUserById(comment.authorId);
        commentsUpdated.push({
            id: comment.id,
            comment: comment.text,
            author: {...commentAuthor, password: ""}
        })
    }

    return {
        id: item.id,
        title: item.title,
        detail: item.detail,
        vote: item.vote,
        author: {...feedbackAuthor, password: ""},
        comments: commentsUpdated,
        type,
        status
    };
}

module.exports.getFeedback = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        await connectToDatabase();
        const item = await getFeedbackById(event.pathParameters.id);
        if (item) {
            const feedbackWithData = await fillFeedback(item);
            return callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': process.env.CLIENT,
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(feedbackWithData)
            })
        }
        return callback(null, sendErrorResponse({
            statusCode: 404,
            message: "Feedback with id " + event.pathParameters.id + " not found"
        }))
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.getTypeList = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await connectToDatabase();
        const typesList = await getTypes();

        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(typesList)
        })
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.getFeedbackList = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await connectToDatabase();
        const feedbacks = !event.queryStringParameters ? await getFeedbacks() : await getFeedbacksByType(event.queryStringParameters);

        const feedbackList = [];

        for (const item of feedbacks) {
            const feedback = await fillFeedback(item);
            feedbackList.push(feedback);
        }

        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(feedbackList)
        })
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.getRoadmap = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await connectToDatabase();
        const feedbacks = await getFeedbacks();
        const statuses = await getStatuses();
        const roadmap = {
            "Planned": {},
            "InProgress": {},
            "Live": {},
        };
        for (const item of statuses) {
            roadmap[item.status] = {...item, quantity: 0};
        }

        for (const feedback of feedbacks) {
            const status = await getStatusByParam({'id': feedback.statusId});
            roadmap[status.status].quantity += 1;
        }

        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify([roadmap["Planned"], roadmap["InProgress"], roadmap["Live"]])
        })
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.saveComment = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        const validationItems = [
            {value: data.authorId, fieldname: "author", rules: ['validateRequired']},
            {value: data.text, fieldname: "comment", rules: ['validateRequired']},
            {value: data.feedbackId, fieldname: "feedback", rules: ['validateRequired']},
        ];

        validateSetOfFields(validationItems);
        await connectToDatabase();
        await checkToken(event.headers);

        data.id = uuidv4();

        const item = await Comment.create({
            ...data
        });
        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                ...item["_doc"]
            })
        })
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.createFeedback = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        const validationItems = [
            {value: data.type.id, fieldname: "type", rules: ['validateRequired']},
            {value: data.title, fieldname: "title", rules: ['validateRequired']},
            {value: data.detail, fieldname: "detail", rules: ['validateRequired']},
        ];

        validateSetOfFields(validationItems);
        await connectToDatabase();
        await checkToken(event.headers);

        const feedbackItemSave = {
            id: "",
            statusId: data.status.id,
            title: data.title,
            detail: data.detail,
            vote: data.vote,
            typeId: data.type.id,
            authorId: data.author.id,
        }

        if (data.id) {
            feedbackItemSave.id = data.id;
            const updated = await Feedback.findOneAndUpdate({id: data.id}, feedbackItemSave, {
                new: true
            }).exec();
            return callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': process.env.CLIENT,
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    ...updated["_doc"]
                })
            })
        }
        feedbackItemSave.id = uuidv4();

        const searchStatus = await getStatusByParam({'status':  { $regex: "Planned" }});
        feedbackItemSave.statusId = searchStatus.id || "";

        const item = await Feedback.create({
            ...feedbackItemSave
        });
        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                ...item["_doc"]
            })
        })
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
}

module.exports.createStatus = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        data.id = uuidv4();
        data.description = data.description || "";
        const validationItems = [
            {value: data.status, fieldname: "status", rules: ['validateRequired']}
        ];

        validateSetOfFields(validationItems);

        await connectToDatabase();
        await checkToken(event.headers);
        const searchValue = new RegExp(data.status, 'i');
        const searchStatus = await getStatusByParam({'status':  { $regex: searchValue }});
        if (searchStatus) {
            return callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': process.env.CLIENT,
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    ...searchStatus
                })
            })
        }
        await Status.create({
            ...data
        });
        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                ...data
            })
        });
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
};

module.exports.createType = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const data = parseData(event.body);
        data.id = uuidv4();
        const validationItems = [
            {value: data.type, fieldname: "type", rules: ['validateRequired']}
        ];

        validateSetOfFields(validationItems);

        await connectToDatabase();
        const searchValue = new RegExp(data.type, 'i');
        const searchType = await getTypeByParam({'type':  { $regex: searchValue }});
        if (searchType) {
            return callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': process.env.CLIENT,
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    ...searchType
                })
            })
        }
        await Type.create({
            ...data
        });
        return callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.CLIENT,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                ...data
            })
        });
    } catch (e) {
        callback(null, sendErrorResponse({
            statusCode: e.statusCode,
            message: e.message || e.body
        }))
    }
};
