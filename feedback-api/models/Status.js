const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    id: String,
    status: String,
    description: String,
});

module.exports = mongoose.model('Status', StatusSchema);
