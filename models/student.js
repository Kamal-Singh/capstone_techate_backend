const   mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registration: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    class: {
        type: String,
        default: 'Not Alloted'
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    }
});

module.exports = mongoose.model('student', Schema);