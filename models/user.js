const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose')

let Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.plugin(passportLocalMongoose);
module.exports  = new mongoose.model('user', Schema);