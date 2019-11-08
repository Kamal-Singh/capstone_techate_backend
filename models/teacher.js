const   mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
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
    },
    photo: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('teacher', Schema);