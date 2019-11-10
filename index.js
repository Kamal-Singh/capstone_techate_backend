const   express = require('express'),
        app     = express(),
        bodyParser  = require('body-parser'),
        passport    = require('passport'),
        mongoose    = require('mongoose'),
        localStrategy = require('passport-local'),
        flash         = require('connect-flash'),
        methodOverride = require('method-override'),
        db = require('./models')

// Routes Variables
let authRoutes = require('./routes/index')

// Setting Up Enviornment Variables
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/attendance_system';
const PASSKEY = process.env.PASSKEY || 'asjkdfljasdfkjlaksjflkjasdf93ijdf94838jf';
const PORT = process.env.PORT || 3000;

// Setting Up Middlewares
mongoose.connect(DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
mongoose.Promise = global.Promise;
mongoose.set('debug',true);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
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

//Configure Passport
passport.use(new localStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(function(req, res, next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
});

//==========================
// ROUTES         
//==========================
app.use(authRoutes);


//==========================
// SERVER LISTENER         
//==========================
app.listen(PORT,function(req,res) {
    console.log(`The application is running on http://localhost:${PORT}`);
});
