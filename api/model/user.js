const mongoose= require("mongoose");
const userSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{type:String,required:true,unique:true,match:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/},
    password:{type:String,required:true}
});

module.exports=mongoose.model('User',userSchema);