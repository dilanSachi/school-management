var express=require('express');
var router=express.Router();
var fileupload=require('express-fileupload');
var bodyparser=require('body-parser');
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
var path=require('path');

router.use(fileupload());

var leaveDB=require('../models/teacher-leaves');
var circularData=require('../models/data-circular');
var userDB=require('../models/users');

router.get('/',ensureAuthenticated,function(req,res){
  res.render('principal/principal');
});

router.get('/circulars',ensureAuthenticated,function(req,res){
  res.render('principal/circulars');
});

router.post('/circulars/upload',ensureAuthenticated,function(req,res){
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


router.get('/leaveApps',ensureAuthenticated,function(req,res){
  leaveDB.find({},function(err,data){
    res.render('principal/leaveList',{data});
  });
});

router.get('/leaveDetails/:id',ensureAuthenticated,function(req,res){
  leaveDB.findById(req.params.id,function(err,details){
    if(err){
      console.log(err);
    }else{
      res.render('principal/leaveDetails',{details});
    }
  });
});

router.post('/leave/approval/:id',ensureAuthenticated,function(req,res){
  var approved;
  if(req.body.approval=='Approve'){
    approved=true;
  }else{
    approved=false;
  }
  leaveDB.update({_id:req.params.id},{approved:approved},function(err){
    if(err){
      console.log(err);
    }else{
      //res.redirect('/principal/');
      res.json({approval:approved});
    }
  });
});


router.get('/schemes',ensureAuthenticated,function(req,res){
  res.render('principal/schemes');
});

router.get('/getSchemes',ensureAuthenticated,function(req,res){
  res.sendFile(path.join(__dirname,'../views/principal/x.html'));
});


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated() && (req.user.designation=='Principal')){
    return next();
  }else{
    req.logout();
    res.redirect('/');
  }
}

module.exports=router;
