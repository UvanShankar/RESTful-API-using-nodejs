const express = require("express");
const mongoose= require("mongoose")
const bcrypt= require("bcrypt");
const router=express.Router();
const jwt = require("jsonwebtoken");
const User= require("../model/user");

router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email}).exec().then(user=>{
if(user.length>=1)
return res.status(409).json({message:"email id is alredy used"});
else{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        return res.status(500).json({err:err});
        else{
            const user=new User(
                {
                    _id:mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash ,
                }
            );
user.save().then(result=>{
    console.log(result);
    res.status(200).json({message:"user created",
    });  
}).catch(err=>{console.log(err);
    res.status(500).json({error:err
});});
        }
    })
}
    }).catch(err=>{
        res.status(500).json({error:err
        })
    });
  
   
});



router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).exec().then(user=>{
if(user.length===0)
return res.status(409).json({message:"Auth Failed"});
else{
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
        if(err)
        return res.status(500).json({err:err,mess:"error in compare"});
        if(result)
        {
           const token= jwt.sign({userId:user[0]._id,email:user[0].email},"secret",{expiresIn:"1h"});
            
            
            res.status(200).json({message:"Login sucessful",token:token});
        }
           else
            res.status(500).json({message:"Incorrect Password"});

        
    })
}
    }).catch(err=>{
        res.status(500).json({error:err
        })
    });
  
   
});

router.delete('/:userid',(req,res,next)=>{
    User.remove({_id:req.params.userid}).exec().then(
        result=>{res.status(200).json({message:"deleted user ",
    output:result});}
    ).catch(err=>{res.status(500).json({message:err});});
});
module.exports=router;