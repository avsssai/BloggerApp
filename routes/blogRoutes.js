var express = require("express");
var Blog = require("../models/blog");
var middleware = require('../middleware/index');
var {check ,validationResult} = require('express-validator');
var expressSanitizer = require('express-sanitizer');

var router = express.Router();


router.get('/',(req,res)=>{
    res.redirect('/home');
})

//index
router.get('/home',(req,res)=>{
    Blog.find({})
        .then(allBlogs=>{
            res.render('blogs/home',{blogs:allBlogs});
        })
        .catch(err=>console.log(err));
});

//new

router.get('/home/new',middleware.isLoggedIn,(req,res)=>{
    res.render('blogs/new');
})

//create
router.post('/home',middleware.isLoggedIn,(req,res)=>{
    var owner = {
        id:req.user._id,
        username: req.user.username
    }
    const sanitizedBody = req.sanitize(req.body.body);

    var newBlog = {
        title: req.body.title,
        author: req.body.author,
        image:req.body.image,
        body: sanitizedBody,
        date: req.body.date,
        owner: owner
    };

    Blog.create(newBlog)
        .then(createdBlog=>{
            console.log({success:true,message:"New Blog created"});
            res.redirect('/home');
        })
        .catch(err=>console.log(err));
})

//show
router.get("/home/:id",(req,res)=>{
    var id = req.params.id;

    Blog.findById(id).populate('comments').exec()
        .then(foundBlog=>{
            res.render('blogs/show',{blog:foundBlog});
        })
        .catch(err=>{console.log(err)
            res.redirect('/home')
        });
});

//delete
router.delete('/home/:id',middleware.checkBlogOwnership,(req,res)=>{
    var id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(foundBlog=>{
            console.log({success:true,message:"Blog deleted."});
            res.redirect('/home');
        })
        .catch(err=>console.log(err));
})

//edit
router.get('/home/:id/edit',middleware.checkBlogOwnership,(req,res)=>{
    var id = req.params.id;
    Blog.findById(id)
        .then(foundBlog=>{
            res.render('blogs/edit',{blog:foundBlog});
        })
        .catch(err=>{res.redirect('back'); console.log(err)});
})

//update
router.put('/home/:id',middleware.checkBlogOwnership,(req,res)=>{
    var id = req.params.id;
    const sanitizedBody = req.sanitize(req.body.body);
    var updatedBlog = {
        title: req.body.title,
        author: req.body.author,
        image: req.body.image,
        body: sanitizedBody
    };

    Blog.findByIdAndUpdate(id,updatedBlog)
        .then(updatedBlog=>{
            console.log({
                success:true,
                message:"Blog updated."
            })
            res.redirect('/home/'+id);
            
        })
        .catch(err=>{
            console.log(err);
            res.redirect('/home/'+id);
        })
})



module.exports = router;