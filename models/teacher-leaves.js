var mongoose=require('mongoose');

var dataSchema=mongoose.Schema({
  teacherName:{
    type:String,
    required:true
  },
  designation:{
    type:String,
    required:true
  },
  noOfLeaveDays:{
    type:String,
    required:true
  },
  leavesTaken:{
    type:String,
    required:true
  },
  dateOfCommencingLeave:{
    type:String,
    required:true
  },
  dataOfResumingLeave:{
    type:String,
    required:true
  },
  reason:{
    type:String,
    required:true
  },
  approved:{
    type:Boolean,
  }
});

var leaveData=module.exports=mongoose.model('techerLeaveData',dataSchema);
