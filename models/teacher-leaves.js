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
    type:Number,
    required:true
  },
  leavesTaken:{
    type:Number,
    required:true
  },
  dateOfCommencingLeave:{
    type:Number,
    required:true
  },
  dateOfResumingLeave:{
    type:Number,
    required:true
  },
  reason:{
    type:String,
    required:true
  },
  approved:{
    type:String,
    required:true
  }
});

var leaveData=module.exports=mongoose.model('teacherLeaveData',dataSchema);
