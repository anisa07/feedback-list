const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    id: String,
    authorId: String,
    feedbackId: String,
    text: String,
});

module.exports = mongoose.model('Comment', CommentSchema);
