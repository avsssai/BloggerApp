var mongoose = require('mongoose');
var User = require('../models/user');
var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var {
    check,
    validationResult
} = require('express-validator');

var router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
});


router.get('/register', (req, res) => {
    res.render('auth/register');
});


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash:true,
        failureMessage:"Invalid credentials!"

    }), (err, login) => {
        if (err) {
            console.log(err);
            req.flash("error","Invalid Credentials!");
        }
    });

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully!");
    res.redirect('/home');
})

module.exports = router;