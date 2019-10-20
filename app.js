var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose  = require("mongoose"),
    blogRoutes = require('./routes/blogRoutes'),
    authRoutes = require('./routes/authRoutes'),
    commentRoutes = require('./routes/commentRoutes'),
    methodOverride = require('method-override'),
    session= require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    validator = require('express-validator'),
    flash = require('connect-flash'),
    expressSanitizer = require('express-sanitizer'),
    env = require('dotenv').config();

    var DbConnection = process.env.DB_HOST || "mongodb://localhost:27017/blog";
    


    mongoose.connect(DbConnection,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
        .then(res=>console.log("Connected to the DB."))
        .catch(err=> console.log(err));
    
        
    
// mongoose.connect("mongodb://localhost:27017/blog",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
//     .then(res=>console.log("Connected to the DB."))
//     .catch(err=> console.log(err));

    // mongodb://localhost:27017/blog
var app = express();
var PORT = 5000;

app.use(session({
    secret:"shiva",
    resave:false,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

app.use(express.static("public"));
app.use(flash());





passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
});

app.use(express.json());
app.use(expressSanitizer());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set("view engine","ejs");
app.use(methodOverride("_method"));

app.use('/',blogRoutes);
app.use('/',authRoutes);
app.use('/home/:id',commentRoutes);

app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Listening on port "+PORT);
});
