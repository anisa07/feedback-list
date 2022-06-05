const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    id: String,
    type: String
});

module.exports = mongoose.model('Type', TypeSchema);
