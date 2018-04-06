var express=require('express');
var router=express.Router();
var fileupload=require('express-fileupload');

router.use(fileupload());

var leaveData=require('../models/teacher-leaves');

router.get('/',ensureAuthenticated,function(req,res){
  res.render('teacher/teacher');
});

router.get('/applyLeave',ensureAuthenticated,function(req,res){
  res.render('teacher/leave-application');
});

router.post('/leaveApp',ensureAuthenticated,function(req,res){
  var leavedata=new leaveData();
  leavedata.teacherName=req.body.teacherName;
  leavedata.designation=req.body.designation;
  leavedata.noOfLeaveDays=req.body.noOfLeaveDays;
  leavedata.leavesTaken=req.body.leavesTaken;
  leavedata.dateOfCommencingLeave=req.body.dateOfCommencingLeave;
  leavedata.dataOfResumingLeave=req.body.dataOfResumingDuty;
  leavedata.reason=req.body.reason;
  leavedata.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/teacher/');
    }
  });
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated() && (req.user.designation=='Teacher')){
    return next();
  }else{
    req.logout();
    res.redirect('/');
  }
}
module.exports=router;
