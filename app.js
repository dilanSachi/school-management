var express=require("express");
var path=require('path');
var mongoose=require('mongoose');
const config=require('./config/database');

var app=express();

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

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//get request for home
app.get('/',function(req,res){
  res.render('principal');
});

//routing the requests
var principal=require('./routes/principal');
app.use('/principal',principal);

//create server
app.listen('9000',function(){
  console.log('Server started on port 9000');
});
