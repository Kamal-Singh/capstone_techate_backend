const   express = require('express'),
        app     = express(),
        bodyParser  = require('body-parser'),
        passport    = require('passport'),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        localStrategy = require('passport-local'),
        flash         = require('connect-flash')

// Setting Up Enviornment Variables
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/admin_panel';
const PASSKEY = process.env.PASSKEY || 'asjkdfljasdfkjlaksjflkjasdf93ijdf94838jf';
const PORT = process.env.PORT || 3000;

// Setting Up Middlewares
mongoose.connect(DATABASE_URL,{ useMongoClient: true});
mongoose.Promise = global.Promise;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded{ extended: true});
app.use(express.static(__dirname+'/public'));
app.use(methodOverrdie('_method'));
app.use(flash());

//Configuring Session
app.use(require('express-session')({
    secret: PASSKEY,
    saveUninitialized: false,
    resave: false
}));

//Initializing Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

//==========================
// SERVER LISTENER         
//==========================
app.listen(PORT,function(req,res) {
    console.log(`The application is running on http://localhost:${PORT}`);
});
