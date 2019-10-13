var express = require('express');
var mongoose =require('mongoose');
var Blog = require('../models/blog');
var Comment = require('../models/comment');

var middleware = {};

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("back");
    }
};

middleware.checkBlogOwnership = function(req,res,next){
    //check if the user is logged in.
    if(req.isAuthenticated()){
        var id = req.params.id;
        //get the blog in required.
        Blog.findById(id)
            .then(foundBlog=>{
            //check if the user owns the blog
                if(foundBlog.owner.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect('back');
                }
            })
            .catch(err=>{
                console.log(err);
                res.redirect('back')
            })
    }else{
        res.redirect('back');
    }
}

middleware.checkCommentOwnership = function(req,res,next){
    var id = req.params.comment_id;
    //is the user logged in.
    if(req.isAuthenticated()){
        //does the user own the comment
        Comment.findById(id)
            .then(foundComment=>{
                if(foundComment.owner.id.equals(req.user._id)){
                    next();

                }else{
                    req.redirect('back');
                }
            })
            .catch(err=>{
                console.log(err);
                res.redirect("back");
            })
    }
}

module.exports = middleware;
