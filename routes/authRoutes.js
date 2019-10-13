var mongoose = require('mongoose');
var User = require('../models/user');
var express = require('express');
var User = require('../models/user');
var passport = require('passport');

var router = express.Router();

router.get('/login',(req,res)=>{
    res.render('auth/login');
});


router.get('/register',(req,res)=>{
    res.render('auth/register');
});

router.post('/register',(req,res)=>{

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
    User.register(new User({username:req.body.username}),req.body.password)
        .then(user=>{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/home');
            })
        })
        .catch(err=>{
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
        
    }),(err,login)=>{
        if(err){
            console.log(err);
        }
    });

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/home');
})    

module.exports = router;