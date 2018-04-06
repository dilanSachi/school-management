const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/users');
const config=require('../config/database');
const bcrypt=require('bcryptjs');

module.exports=function(passport){
  passport.use(new LocalStrategy(function(username,password,done){
    var query={username:username};
    User.findOne(query,function(err,user){
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'No User Found'});
      }

      if(!user.password==(password)){
        return done(null,false);
      }else{
        return done(null,user);
      }

      /*bcrypt.compare(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        }else{
          return done(null,false,{message:'Wrong Password'});
        }
      });*/
    });
  }));
  passport.serializeUser(function(user,done){
    done(null,user.id);
  });
  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });
}