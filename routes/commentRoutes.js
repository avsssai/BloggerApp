var express = require("express");
var User = require("../models/user");
var Blog = require("../models/blog");
var Comment = require('../models/comment');
var middleware = require('../middleware/index');

var router = express.Router({
  mergeParams:true
});

router.post("/", middleware.isLoggedIn,(req, res) => {
  //get the required blog
  var id = req.params.id;
  Blog.findById(id)
    .then(foundBlog => {
      //post the comment in the req.body
      //its associating the comment in the blog.
      var commentText = req.body.comment;
      var comment = {
        text: commentText
      };
      if (commentText.length > 0) {
        Comment.create(comment)
          .then(createdComment => {
            createdComment.owner.id = req.user._id;
            createdComment.owner.username = req.user.username;
            //save created comment.
            createdComment.save();
            console.log(createdComment);
            //push comment into blog.
            foundBlog.comments.push(createdComment);
            //save the blog.
            foundBlog.save();

            res.redirect("/home/" + id);
          })
          .catch(err => {
            console.log(err);
            res.redirect("back");
          });
      } else {
        res.redirect("back");
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect("back");
    });
});

router.delete('/comments/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
  var id = req.params.comment_id;
    Comment.findByIdAndDelete(id)
      .then(foundComment=>{
        console.log({
          success:true, message:"Comment deleted."
        });
        res.redirect("back");
      })
      .catch(err=>{
        console.log(err);
        res.redirect('back');
      })
})


module.exports = router;
