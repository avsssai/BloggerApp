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

router.post('/register', [
    check('username').isEmail().withMessage("Must be an email address."),
    check('password').isLength({
        min: 6
    }).withMessage("Password must be atleast 6 characters long.")

], (req, res) => {

    // User.register(new User({username: req.body.username}),req.body.password)
    //     .then(user=>{
    //         passport.authenticate('local')(req,res,()=>{
    //             res.redirect('/home');
    //             console.log(req.user);
    //         })
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //         res.redirect('/home/register');
    //     })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });

        //IF there are validation errors.
        return res.render('auth/register', {
            errors: errors.array()
        });

    }

    
    User.register(new User({
            username: req.body.username
        }), req.body.password)
        .then(user => {

            passport.authenticate('local')(req, res, () => {
                console.log("new user added.");
                res.redirect('/home');

            })
        })
        .catch(err => {


            res.redirect('/register');
            console.log(err);



        });
});

// router.post('/login',passport.authenticate('local',{
//     successRedirect:'/',
//     failureRedirect:'/login'
// }),(req,res)=>{

// });
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'

    }), (err, login) => {
        if (err) {
            console.log(err);
        }
    });

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success","Logged out successfully!");
    res.redirect('/home');
})

module.exports = router;