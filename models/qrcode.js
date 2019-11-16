const   mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    students: [{
        type: String
    }]
});

module.exports  = new mongoose.model('qrcode', Schema);