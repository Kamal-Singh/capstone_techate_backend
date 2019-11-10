var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    db = require('../models');

// Setting up Environment Variables
const SECRET_KEY = process.env.SECRET_KEY || '123456';
router.get('/', function (req, res) {
    res.render('login');
});

//==========================
// Authentication Routes
//==========================

// New User Form
router.get('/register', function (req, res) {
    res.render("register");
});

// Create User
router.post('/register', function (req, res) {
    if (req.body.secretKey !== SECRET_KEY) {
        req.flash('error', 'Wrong Secret Key!!');
        return res.redirect('/register');
    }
    db.User.register(new db.User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Hi ' + req.user.username + ' ,You Have Been Successfully Registered');
            res.redirect('/');
        });
    });
});

// Authentication 
router.post('/', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));

//  Logout 
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You Have Been Successfully Logout!!');
    res.redirect('/');
});

module.exports = router;