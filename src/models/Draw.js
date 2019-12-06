const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    name: String,
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Draw', DrawSchema);