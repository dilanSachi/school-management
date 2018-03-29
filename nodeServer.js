var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bodyParser = require("body-parser");

var app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: false}));

app.use('/assets',express.static('assets'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/sign-up', function (req, ress) {
    console.log(req.body);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

        var myobj = {firstName:req.body.firstName, lastName:req.body.lastName, age:req.body.age,type:req.body.userType, username: req.body.username, password: req.body.passwordI};

        var neww=dbo.collection("customers").insert(myobj, function(err, res) {
            if (err){
                throw err
            } else{
                console.log('Signed-up successfully');
                ress.sendFile(__dirname + '/index.html');
            };
        });
        db.close();
    });
});

app.post('/log-in', function (req, ress) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

        var myobj = {username: req.body.username, password: req.body.password};

        var xxx = dbo.collection("customers").find({
            'username': myobj.username,
            'password': myobj.password
        }).toArray(function (err, result) {
            if (err) {
                throw err;
            } else if (result.length != 0) {
                if(result[0].type==1){
                    ress.render('adminProfile',{admin:result[0].firstName});
                }else if(result[0].type==2){
                    ress.render('stuProfile',{student:result[0].firstName});
                }else if(result[0].type==3){
                    ress.render('teaProfile',{teacher:result[0].firstName});
                }
            } else {
                ress.send('Invalid Login');
            }
        });
        db.close();
    });
});


var server = app.listen(9000, function () {
    console.log('Node server is running..');
});
