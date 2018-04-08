const express=require("express");
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const config=require('./config/database');
const expressValidator=require('express-validator');
const session=require('express-session');
const passport=require('passport');
const bcrypt=require('bcryptjs');
const fileupload=require('express-fileupload');

var app=express();

app.use(fileupload());

//connect to database
mongoose.connect(config.database);
var db=mongoose.connection;

db.on('error',function(err){
  console.log(err);
});
db.once('open',function(){
  console.log('Connected to MongoDB');
});

//set viewengine
app.engine('ejs',require('express-ejs-extend'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(expressValidator());

var userDB=require('./models/users');

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user=req.user || null;
  //console.log(res.locals.user);
  //console.log(req.user);
  next();
});

app.get('/',function(req,res){
  res.render('login');
});

app.post('/user/login',function(req,res,next){
  //passport.authenticate('local',{failureRedirect:'/'},
  passport.authenticate('local',{
    successRedirect:'/main',
    failureRedirect:'/'
  })(req,res,next);
    /*  if(res.locals.user.designation=='teacher'){
        res.redirect('/teacher');
      }else if(res.locals.user.designation=='Principal'){
        res.redirect('/principal');
      }
//  )(req,res,next);*/
});

app.get('/main',ensureAuthenticated,function(req,res){
  res.render('main');
});

//routing the requests
var principal=require(__dirname+'/routes/principal');
app.use('/principal',principal);

var teacher=require(__dirname+'/routes/teacher');
app.use('/teacher',teacher);

//create server
app.listen('9000',function(){
  console.log('Server started on port 9000');
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }
}
