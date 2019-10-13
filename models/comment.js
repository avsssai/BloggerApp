var express = require('express');
var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    owner:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    text:String,
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Comment",commentSchema);