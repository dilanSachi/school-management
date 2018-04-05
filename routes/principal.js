var express=require('express');
var router=express.Router();
var fileupload=require('express-fileupload');

router.use(fileupload());

var circularData=require('../models/data-circular');

router.get('/circulars',function(req,res){
  res.render('circulars');
});

router.post('/circulars/upload',function(req,res){
  if(!req.files.sampleFile){
    return res.status(400).send('No files were uploaded.');
  }else{
    let sampleFile = req.files.sampleFile;
    circularData.findOne({fileName:sampleFile.name},function(err,file){
      if(err){
        console.log(err);
      }else{
        if(file==null){
          var dir='./uploads/circulars/'+sampleFile.name;
          var newCircular=new circularData();
          newCircular.fileName=sampleFile.name;
          newCircular.grade=req.body.grade;
          newCircular.author='Dinga';
          newCircular.save(function(err){
            if(err){
              console.log(err);
            }else{
              sampleFile.mv(dir, function(err) {
                if(err){
                  return res.status(500).send(err);
                }else{
                  res.redirect('/principal/circulars');
                }
              });
            }
          });
        }else{
          console.log('File already exists');
          res.redirect('/principal/circulars');
        }
      }
    });
  }
});


router.get('/leaveApp',function(req,res){
  res.render('leaveApp');
});

router.get('/schemes',function(req,res){
  res.render('schemes');
});

router.get('/timeTable',function(req,res){
  res.render('timeTable');
});

router.get('/examTimeTable',function(req,res){
  res.render('examTimeTable');
});


module.exports=router;
