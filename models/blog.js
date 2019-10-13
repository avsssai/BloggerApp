var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    },
    owner:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("Blog",blogSchema);