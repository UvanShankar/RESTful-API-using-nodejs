const express = require("express");
const Order =require("../model/ordermodel");
const mongoose= require("mongoose")
const Product =require("../model/product");
const router=express.Router();
const checkAuth= require("../middleware/check-auth");
router.get('/',(req,res,next)=>
{
console.log("req body start");
console.log(req.body); 
console.log("req body end");
    Order.find().populate("product").exec()
    .then(doc=>{
  
    const respon={
        count:doc.length,
        products:doc.map(doc=>{
            return {productId:doc.product,
                    quantity:doc.quantity,
                    _id:doc._id,
                    requset:{
                        type:"GET",
                        url:"http://localhost:3000/order/"+doc._id
                    }
    }
        })
    }
    console.log(doc);
    if(doc){
    res.status(200).json(respon);
    }else
    res.status(404).json({value:"empty"});
}).catch(err=>{console.log(err);
         res.status(500).json({error:err});
});
//res.status(200).json({message:"order  fetched"});
});

router.post('/',checkAuth,(req,res,next)=>
{
    Product.findById(req.body.productId).exec().then(resu=>{
        if(!resu)
        res.status(500).json({error:err,message:"Product with this id not found"  });
        else{
        console.log("req body");
        console.log(req.body); 
       const order=new Order({
           _id: mongoose.Types.ObjectId(),
           product:req.body.productId,
           quantity:req.body.quantity
       });
       console.log(req.body.productId);
       order.save().then(result=>{
           console.log(result);
           res.status(201).json({message:"order given sucessfull",order:result});
       }).catch(err=>{console.log(err);
           res.status(500).json({error:err
       });});}
    }).catch(err=>{
        res.status(500).json({error:err,message:"Product with this id not found"  });
    });
    console.log("req body");
 console.log(req.body); 
const order=new Order({
    _id: mongoose.Types.ObjectId(),
    product:req.body.productId,
    quantity:req.body.quantity
});
console.log(req.body.productId);
order.save().then(result=>{
    console.log(result);
    res.status(201).json({message:"order given sucessfull",order:result});
}).catch(err=>{console.log(err);
    res.status(500).json({error:err
});});

});

router.get('/:orderId',(req,res,next)=>
{const id=req.params.orderId;
    Order.findById(id).exec()
    .then(doc=>{
        console.log(doc);
        if(doc)
        res.status(200).json(doc);
        else
        res.status(404).json({value:"no data for this id"});
    }).catch(err=>{console.log(err);
             res.status(500).json({error:err});
 });
});


router.delete('/:orderId',checkAuth,(req,res,next)=>
{const id=req.params.orderId;
    Order.remove({_id:id}).exec()
    .then(result=>{res.status(200).json({message:"deleted order ",
output:result});})
    .catch(err=>{res.status(500).json({message:err});});

});
module.exports=router;