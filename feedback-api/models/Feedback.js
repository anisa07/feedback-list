const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    id: String,
    statusId: String,
    typeId: String,
    authorId: String,
    title: String,
    detail: String,
    vote: {
        voteDown: [String],
        voteUp: [String]
    },
    commentIds: [String]
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
