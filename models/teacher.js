const   mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registration: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        default: 'Not Alloted'
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
    }
});

module.exports = mongoose.model('teacher', Schema);