var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    db = require('../models'),
    middleware = require('../middleware'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    { spawn } = require('child_process'),
    DOWNLOAD_PATH = require('../config').DOWNLOAD_PATH,
    ENCODING_PATH = require('../config').ENCODING_PATH

// Setting up Environment Variables
const SECRET_KEY = process.env.SECRET_KEY || '123456';

// Setting Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file uploaded")
        cb(null, DOWNLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    }
})
const upload = multer({ dest: DOWNLOAD_PATH, storage: storage })

// Setting Python Spawn
create_encoding_script = function (file_path, save_path, person_name) {
    return spawn('python3', ["-u", path.join(__dirname, '../scripts/create_encodings.py'),
        file_path, save_path, person_name])
}

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
            res.redirect('/home');
        });
    });
});

// Authentication 
router.post('/', passport.authenticate('local', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/home', middleware.isLoggedIn, function (req, res) {
    res.render('home');
});

router.get('/student_form', middleware.isLoggedIn, function (req, res) {
    res.render('student_form');
});

router.get('/teacher_form', middleware.isLoggedIn, function (req, res) {
    res.render('teacher_form');
});

router.post('/add_student', middleware.isLoggedIn, upload.single('image'), function (req, res) {
    const file = req.file
    if(!file)
    {
      req.flash('error', "Image Not Uploaded");
      return res.redirect('/student_form');
    }
    let filename = req.body.registration;
    let save_path = ENCODING_PATH;
    const subprocess = create_encoding_script(file.path,save_path,filename)
    subprocess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    subprocess.stderr.on('data', (data) => {
      console.log(`error:${data}`);
    });
    subprocess.stderr.on('close', () => {
      console.log("Spawn Completed");
    });
    let student = {
        name: req.body.name,
        registration: req.body.registration,
        mobile: req.body.mobile,
        email: req.body.email,
        section: req.body.section || 'Not Alloted',
        password: req.body.password || '123456'
    };
    db.Student.create(student, function (err, newStudent) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/student_form');
        }
        req.flash('success', 'New Student Added Successfully');
        res.redirect('/student_form');
    })
});

router.post('/add_teacher', middleware.isLoggedIn, function (req, res) {
    let teacher = {
        name: req.body.name,
        registration: req.body.registration,
        mobile: req.body.mobile,
        email: req.body.email,
        section: req.body.section || 'Not Alloted',
        password: req.body.password || '123456'
    };
    db.Teacher.create(teacher, function (err, newTeacher) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/teacher_form');
        }
        req.flash('success', 'New Teacher Added Successfully');
        res.redirect('/teacher_form');
    })
});

router.post('/search', middleware.isLoggedIn, function (req, res) {
    let data = '';
    db.Student.findOne({ registration: req.body.search }, function (err, foundStudent) {
        if (err) {
            data = '';
            res.render('search', { data: data });
        } else {
            data = foundStudent;
            res.render('search', { data: data });
        }
    });
});

router.post('/edit_images', middleware.isLoggedIn, function(req,res) {
    let registration = req.body.registration;
    console.log(req.body);
    if(!registration)
    {
        req.flash('error', 'No registration number mentioned!!');
        return res.redirect('/home');
    }
    res.render('edit_images', { registration: registration });
});

router.post('/update_images', middleware.isLoggedIn, upload.single('image'), function(req,res) {
    const file = req.file
    if(!file)
    {
      req.flash('error', "Image Not Uploaded");
      return res.redirect('/');
    }
    let filename = req.body.registration;
    console.log(filename);
    let save_path = ENCODING_PATH;
    const subprocess = create_encoding_script(file.path,save_path,filename)
    subprocess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    subprocess.stderr.on('data', (data) => {
      console.log(`error:${data}`);
    });
    subprocess.stderr.on('close', () => {
      console.log("Spawn Completed");
    });
    req.flash('success', "Image Updated Sucessfully");
    res.redirect('/home');
});
//  Logout 
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You Have Been Successfully Logout!!');
    res.redirect('/');
});

module.exports = router;